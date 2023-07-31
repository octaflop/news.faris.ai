// get package.json
const packageVersion = require('./package.json').version;

const pluginRss = require('@11ty/eleventy-plugin-rss');
const inclusiveLangPlugin = require('@11ty/eleventy-plugin-inclusive-language');
const bundlerPlugin = require('@11ty/eleventy-plugin-bundle');

module.exports = eleventyConfig => {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(inclusiveLangPlugin);
  eleventyConfig.addPlugin(bundlerPlugin);

  // 	--------------------- Serverless functions ---------------------
  // const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");
  // eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
  //   name: "farisrun",
  //   functionsDir: "./functions/"
  // });

  // status.xml to root directory
  // TODO: Make this dynamic, eg via _data/sitestatus.js
  eleventyConfig.addPassthroughCopy({
    'src/status.xml': '/status.xml'
  });

  // 	--------------------- general config -----------------------
  return {
    // Pre-process *.md, *.html and global data files files with: (default: `liquid`)
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',

    // Optional (default is set): If your site deploys to a subdirectory, change `pathPrefix`, for example with with GitHub pages
    pathPrefix: '/',

    dir: {
      output: 'dist',
      input: 'src',
      includes: '_includes',
      layouts: '_layouts'
    }
  };
};
