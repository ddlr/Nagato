const fs = require('fs')
const path = require('path')

class EventLoader {
  /**
   * @param {Client} bot
   * @param {string} eventsFolder
   */
  constructor(bot, eventsFolder) {
    if (!eventsFolder) {
      throw new Error('No Event Folder Set.')
    }

    this.bot = bot

    this.events = {}
    this.eventsFolder = path.resolve('/', eventsFolder)
  }

  load() {
    return new Promise((resolve, reject) => {
      fs.readdir(this.eventsFolder, (err, files) => {
        if (err) {
          reject(`Error reading events directory: ${err}`)
        } else if (files) {
          files.forEach(file => {
            if (!file.endsWith('.js')) {
              this.bot['log'].warn(`${file} was skipped because it is not a js file.`)
            } else if (file.includes(' ')) {
              this.bot['log'].warn(`${file} was skipped because the file name contains a space.`)
            } else {
              let f = require(`${this.eventsFolder}/${file}`)

              if (!(f.prototype && f.prototype.hasOwnProperty('constructor'))) {
                return
              }

              try {
                const event = new(f)(this.bot)

                if (this.events.hasOwnProperty(event.event)) {
                  this.bot['log'].warn(`${event.event} was skipped because it is ` +
                    `already created in events object.`)
                } else {
                  this.events[event.event] = event;
                }
              } catch (e) {
                this.bot['log'].warn(`${file} - ${e.stack}`)
              }
            }
          })
          resolve(this.events)
        }
      })
    })
  }
}

module.exports = EventLoader
