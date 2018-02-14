localStorage.removeItem('reviews');
var callCount=0;
var dPressed=false;

$(function () {
	
	$(document).keypress(function(e) {
		if(e.keyCode == 115) {
			dPressed=true;
			callCount=0;
			scrap();
		}
		else if(e.keyCode == 100)
		{
			dPressed=true;
			callCount=0;
			Download();
		}
	});
	
	//setTimeout(function() {
		
		// Select the node that will be observed for mutations
		var targetNode = document.getElementById('cm_cr-review_list');

		// Options for the observer (which mutations to observe)
		var config = { childList: true };

		// Callback function to execute when mutations are observed
		var callback = function(mutationsList) {
			
			for(var mutation of mutationsList) {
				if (mutation.type == 'childList') {
					if(dPressed)
					{
						//console.log('A child node has been added or removed.');
						callCount++;
						console.log(callCount);
						if(callCount % 12 == 0)
						{
							test();
						}
					}
				}
			}
		};

		// Create an observer instance linked to the callback function
		var observer = new MutationObserver(callback);

		// Start observing the target node for configured mutations
		observer.observe(targetNode, config);

		// // Later, you can stop observing
		// observer.disconnect();
	

	//}, 7000);

});

function test()
{
	scrap();
}

function scrap()
{
	var data = [];
	var pageCount= $('.a-pagination li:nth-last-child(2)').text();
	var currentPage=$('.a-pagination li.a-selected').text();
	var reviewCountPerPage = $('div[data-hook=review]').length;
	
	if(reviewCountPerPage == undefined || reviewCountPerPage < 10) //retrying
	{
		setTimeout(function() {
			pageCount= $('.a-pagination li:nth-last-child(2)').text();
			currentPage=$('.a-pagination li.a-selected').text();
			reviewCountPerPage = $('div[data-hook=review]').length;
		}, 2000);
	}

	for(var i=0;i<=reviewCountPerPage-1;i++)
	{
		currentPage=$('.a-pagination li.a-selected').text();

		var review= $('div[data-hook=review]')[i];
		console.log(reviewCountPerPage);
		console.log(i);
		console.log(review);
		var reviewTitle = $($(review).find('a[data-hook=review-title]')).text().trim();
		var starRating =  $($(review).find('i[data-hook=review-star-rating] span')).text().trim();
		var reviewBody =  $($(review).find('span[data-hook=review-body]')).text().trim();
		var verifiedPurchase = $($(review).find('span[data-hook=avp-badge]')).text().trim();
		var reviewAuthor = $($(review).find('a[data-hook=review-author]')).text().trim();
		var reviewAuthorProfile = $($(review).find('a[data-hook=review-author]')).attr('href');
		var reviewDate = $($(review).find('span[data-hook=review-date]')).text().trim();
		var helpful = $($(review).find('span[data-hook=helpful-vote-statement]')).text().trim();
		console.log(reviewTitle);
		data.push({'Review Title': reviewTitle, 'Rating': starRating, 'Review': reviewBody, 'Verified':verifiedPurchase, 'Author': reviewAuthor, 'Author Profile': reviewAuthorProfile, 'Review Date': reviewDate, 'Helpful': helpful});
		
		if((i+1)==reviewCountPerPage)
		{
			try
			{
				$('.a-pagination li.a-selected').next().find('a')[0].click();
			}
			catch(err)
			{
				SaveData(data);
				if(parseInt(pageCount) == parseInt(currentPage))
				{
					Download();
					localStorage.removeItem('reviews');
				}
				return;
			}
		}
	}
	SaveData(data);
	if(parseInt(pageCount) == parseInt(currentPage))
	{
		Download();
		localStorage.removeItem('reviews');
	}
}

function SaveData(data)
{
	var savedData = localStorage.getItem('reviews');
	if(savedData == null)
	{
		localStorage.setItem('reviews', JSON.stringify(data));
		//localStorage.setItem('reviews', data);
		return;
	}
	else
	{
		var oldItems = JSON.parse(savedData);
		var finalObj = oldItems.concat(data);
		console.log(finalObj);
		localStorage.setItem('reviews', JSON.stringify(finalObj));
	}
}

function Download()
{
	dPressed=false;
	
	var ReportTitle="Reviews Report";
	////localStorage.removeItem('reviews');
	var savedData = localStorage.getItem('reviews');
	var data = JSON.parse(savedData);
	
	// var data = [
    // {"name":"John", "city": "Seattle"},
    // {"name":"Mike", "city": "Los Angeles"},
    // {"name":"Zach", "city": "New York"}
	// ];

	/* this line is only needed if you are not adding a script tag reference */
	//if(typeof XLSX == 'undefined') XLSX = require('xlsx');

	/* make the worksheet */
	var ws = XLSX.utils.json_to_sheet(data);

	/* add to workbook */
	var wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Reviews");

	/* write workbook (use type 'binary') */
	var wbout = XLSX.write(wb, {bookType:'xlsx', type:'binary'});

	/* generate a download */
	function s2ab(s) {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	}

	saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "Reviews.xlsx");
	
	
}