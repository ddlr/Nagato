'use strict'

const BaseCommand = require('../../lib/Abstracts/BaseCommand')
const qs = require('querystring')
const request_require = require('request-promise-native')
const request = request_require.defaults(
        { gzip: true
        , baseUrl: 'https://derpibooru.org/'
        , headers:
            { 'User-Agent': 'Discord bot by Chrys (github.com/ddlr)'
            }
        }
      )
const filter = 133664
const resultsPerPage = 15 // This is set by Derpibooru

function escapeTags(tags) {
  // Escapes tags, and also ensures that tags != empty string
  return (qs.escape(tags) && tags) ? qs.escape(tags) : '*'
}

async function fetchPage(page, tags) {
  const query = `/search.json?q=${escapeTags(tags)}&page=${page}&filter_id=` +
    `${filter}`
  let results = await request(query)
  const parsed = JSON.parse(results)
  return parsed
}

class Derpibooru extends BaseCommand {
  constructor(bot, type) {
    super(bot, type)
    this.aliases = ['dp']
  }

  get name() {
    return 'derpibooru'
  }

  get help() {
    return 'Searches for a Derpibooru image. If there are multiple results, ' +
      'return a random one.\n' +
      '**Usage:**\n' +
      '~derpibooru fluttershy, cute'
  }

  async process(msg, args) {
    try {
      let results = await fetchPage(1, args)
      // Fetch a random image if there's more than one page (to get more random
      // results)
      if (results.total <= resultsPerPage) {
        // Fetch a random page this time
        const pagesTotal = Math.ceil(results.total / resultsPerPage)
        const page = Math.ceil(Math.random * pagesTotal)
        results = await fetchPage(page, args)
      }
      let image = results.search[Math.floor(Math.random() * resultsPerPage)]
      let imageUrl = image.representations.large
      let imageId = image.id

      let description = ''
      if (args !== '') {
        if (args.length <= 120) {
          description += `**Tags:** ${args}`
        } else {
          description += `**Tags**: ${args.slice(0, 120)}...`
        }
      }

      // Explanation of weird color thing below:
      //
      // color is in format 0xFFFFFF, i.e. any integer
      //     from 0 to 2**24.
      // In this case, set a random colour by doing this:
      //    1 << 24 shifts the 1 24 positions to the
      //    left, giving what is equal to 2**24
      //    Math.random() - turns into random number from
      //        zero to 2**24, of course
      //    | 0 - bitwise OR operator (for integers). In
      //        this case, this takes advantage of the
      //        fact that bitwise operators remove
      //        anything after decimal point
      //    Output is a random integer from 0 to 2**24.

      let result =
      { embed:
        { title: 'Derpibooru page →'
        , url: `https://derpibooru.org/${imageId}`
        , description: description
        , color: ((1 << 24) * Math.random() | 0)
        , image: { url: 'https:' + imageUrl }
        }
      }
      console.log(result)
      await this.execute(msg, result)
    } catch (e) {
      this.bot.log.error(e.message)
    }
  }
}

module.exports = Derpibooru
