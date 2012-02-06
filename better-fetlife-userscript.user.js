/**
 *
 * This is a Greasemonkey script and must be run using Greasemonkey 0.8 or newer.
 *
 * @author Meitar Moscovitz <meitar@maymay.net>
 */
// ==UserScript==
// @name           Better FetLife
// @namespace      maybemaimed.com
// @description    Enhances the functionality of various features of FetLife.com. Best used in conjunction with other browser add-ons, such as those that reveal Microformats.
// @include        http://fetlife.com/*
// @include        https://fetlife.com/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js
// ==/UserScript==

/**
 * Improve individual user profile page.
 */
if (window.location.pathname.match(/^\/users\/[0-9]+/)) {

    // Add hCard classes for markup that's done right.
    $('#profile').addClass('vcard');
    $('.profile_avatar.avatar').addClass('photo');
    $('h2.bottom + p').addClass('adr');
    $($('h2.bottom + p a')[0]).addClass('locality');
    $($('h2.bottom + p a')[1]).addClass('region');
    $($('h2.bottom + p a')[2]).addClass('country-name');

    // Isolate name and add microformat markup.
    $($('h2.bottom').contents()[0]).wrap('<span class="fn" />')

    // Write out URL.
    $('#profile').append('<a style="display: none;" class="url" href="' + window.location.href + '">Make FetLife Better.</a>');
}

/**
 * Improve individual event page.
 */

var x = window.location.pathname;

if (x.match(/^\/events\/[0-9]+\/v1$/)) {
    x = 1;
} else if (x.match(/^\/events\/[0-9]+(\/v2)?$/)) {
    x = 2;
}

switch (x) {
    case 1:
        enhanceVersion1FetLifeEvent();
    break;
    case 2:
        enhanceVersion2FetLifeEvent();
    break;
}

// "Version 1" event pages.
function enhanceVersion1FetLifeEvent () {
    // Add hCalendar classes for markup that's done right.
    $('body').addClass('vevent');
    $('.event_header h2.bottom').addClass('summary');
    $($('.container .clearfix')[1]).addClass('description');
    $($('.event_info td')[7]).addClass('location');

    // Gather event details.

    // Learn dtstart and dtend.
    var times = $('.event_info td')[3].textContent.split(' to ');
    var start = times[0];
    var end = times[1];
    var dtstart = new Date($('.event_info td')[1].textContent);
    dtstart = setHumanTime(start, dtstart);
    var dtend = new Date($('.event_info td')[1].textContent);
    dtend = setHumanTime(end, dtend);

    // Write out missing vevent HTML.
    // Write out dtstart and dtend metadata.
    $($('.event_info td')[3]).addClass('dtstart');
    $($('.event_info td')[3]).attr('title', ISODateString(dtstart));
    $($('.event_info td')[4]).addClass('dtend');
    $($('.event_info td')[4]).attr('title', ISODateString(dtend));

    // Write out URL.
    $('.vevent .description').append('<a style="display: none;" class="url" href="' + window.location.href + '">Make FetLife Better.</a>');
}
// "Version 2" event pages.
function enhanceVersion2FetLifeEvent () {
    $('body').addClass('vevent');
    $('h1[itemprop=name]').addClass('summary');
    $('[itemprop=description]').addClass('description');
    $($('[itemprop=location]').parents().children('span')[1]).addClass('location');

    var start = $('[itemprop=startDate]').attr('content');
    var end = $('[itemprop=endDate]').attr('content');
    $($('[itemprop=startDate]').parents('.db')).addClass('dtstart');
    $($('[itemprop=startDate]').parents('.db')).attr('title', start.substr(0, start.length - 1)); // remove "Z" timezone.
    $($('[itemprop=endDate]').parent()).addClass('dtend');
    $($('[itemprop=endDate]').parent()).attr('title', end.substr(0, end.length - 1));

    // Write out URL.
    $('.vevent .description').append('<a style="display: none;" class="url" href="' + window.location.href + '">Make FetLife Better.</a>');
}

/**
 * Takes in the human time string and a Date object and returns the
 * modified Date object.
 */
function setHumanTime (str, obj_date) {
    // str will be something like "07:00 PM"
    var t = str.match(/[0-9]{2}:[0-9]{2}/).toString();
    var hrs = parseInt(t.split(':')[0], 10); // include decimal radix purposefully
    var min = parseInt(t.split(':')[1], 10);
    // If PM is present, add 12.
    if (str.match(/ PM$/)) {
        hrs += 12;
    }

    obj_date.setHours(hrs);
    obj_date.setMinutes(min);

    return obj_date;
}

// Stolen directly from
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date#Example.3a_ISO_8601_formatted_dates
function ISODateString(d){
 function pad(n){return n<10 ? '0'+n : n}
 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'
}
