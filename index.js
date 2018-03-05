/*
* @Author: d4r
* @Date:   2018-02-11 22:26:41
* @Last Modified by:   d4r
* @Last Modified time: 2018-02-11 23:55:46
*/

'use strict'

const debug = require('debug')('ibadf')
const fs = require('fs')
var htmlToText = require('html-to-text')
const url = 'https://badmintonindonesia.org/app/information/default.aspx?'
const deepurl = 'https://badmintonindonesia.org/app/information/newsDetail.aspx?/6924'
const mockurl = 'https://google.com'

const Xray = require('x-ray');
const options = {}
options['filters'] = {
	removehtml:	function (value) {
		return htmlToText.fromString(value, {
			wordwrap: 130
		});
	}
}
const x = Xray(options);

debug('start scraping')
x(
	url, 
	'.konten_dalem > ul.berita_list',
	{
		content: x(
			'li > .area_teks',[{
				title: 'h3.title',
				lead: '.lead',
				link: '.more_box > a@href',
				details: x('a@href', {
					title: '.berita_details_area > h1.jdl_halaman',
					image: '.berita_details_area .slideshow_didalam_details_inner img@src',
					time: '.berita_details_area > .meta > .meta_time',
					fulltext: '.berita_details_area > .berita_teks.rich_text | removehtml'
				})
				// image: x('#gbar a@href', 'title'), // follow link to google images
			}]
		)
	}	
)(function(err, obj) {
	debug('result : ', obj)
	const text = JSON.stringify(obj, null, 4)
	fs.writeFile('results.json', text, 'utf8', (err) => {
	  if (err) throw err;
	  console.log('The file has been saved!');
	});
})