/*
*
    COPYRIGHT LICENSE: This information contains sample code provided in source code form. You may copy, modify, and distribute
    these sample programs in any form without payment to IBM® for the purposes of developing, using, marketing or distributing
    application programs conforming to the application programming interface for the operating platform for which the sample code is written.
    Notwithstanding anything to the contrary, IBM PROVIDES THE SAMPLE SOURCE CODE ON AN "AS IS" BASIS AND IBM DISCLAIMS ALL WARRANTIES,
    EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, SATISFACTORY QUALITY,
    FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND ANY WARRANTY OR CONDITION OF NON-INFRINGEMENT. IBM SHALL NOT BE LIABLE FOR ANY DIRECT,
    INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR OPERATION OF THE SAMPLE SOURCE CODE.
    IBM HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS OR MODIFICATIONS TO THE SAMPLE SOURCE CODE.

*/
var busyIndicator = null;
var topic = "";

function wlCommonInit(){
	
	busyIndicator = new WL.BusyIndicator(null, {text : 'Loading...'});
	$('#BusyIndicatorStartButton').click(busyIndicatorDemo);
	$('#SimpleDialogStartButton').click(simpleDialogDemo);	
	loadFeeds();
	
	/*Java Adapter(HTTP Request)*/
	WL.Client.connect({onSuccess: connectSuccess, onFailure: connectFailure});
	
	/* Custom Device Provisioning */
	$("#connectToServerButton").click(function(){
		WL.Client.connect({
			  onFailure: onConnectFailure
		});
	});
}

$('#topic').on("change",function(){
	topic = this.value;
	loadFeeds();
});


	


/* ------------------------------------------ UI Controls ------------------------------------------------------- */

function busyIndicatorDemo() {
	busyIndicator.show();
	setTimeout(function() {
		busyIndicator.hide();
	}, 5000);
}

function simpleDialogDemo(sec) {
	var dialogTitle = "CommonControls";
	var dialogText = "This is simple dialog text; take a look at the console";
	
	

	WL.SimpleDialog.show(dialogTitle, dialogText, [ {
		text : 'I am button 1',
		handler : simpleDialogButton1Click
	}, {
		text : 'I am button 2',
		handler : simpleDialogButton2Click
		
	}

	]);
	
	    
	
}



function simpleDialogButton1Click() {
	WL.Logger.debug("simpleDialogButton1 Clicked");
	

}


function simpleDialogButton2Click() {
	WL.Logger.debug("simpleDialogButton2 Clicked");


	

}


/* ----------------------------------------------------------------------------------------------------------------- */



/* ------------------------------------------- Custom Login Module ------------------------------------------------- */

/*function getSecretData(){
	
     * The REST API works with all adapters and external resources, and is supported on the following hybrid environments: 
     * iOS, Android, Windows Phone 8, Windows 8. 
      
	var resourceRequest = new WLResourceRequest("/adapters/DummyAdapter/getSecretData", WLResourceRequest.GET);
	resourceRequest.send().then(
			getSecretData_CallbackOK,
			getSecretData_CallbackFail
	);
}

function getSecretData_CallbackOK(response){
	$("#ResponseDiv").html(JSON.stringify(response.responseJSON));
}

function getSecretData_CallbackFail(response){
	$("#ResponseDiv").html(JSON.stringify(response));
}
*/
/* ------------------------------------------------------------------------------------------------------------------- */


/* ------------------------------------------------------- HTTP Adaptor ---------------------------------------------- */

function getFeeds() {
    var input = {
        method : 'get',
        returnedContentType : 'xml',
        path : "rss.xml"
    };
     
     
    return WL.Server.invokeHttp(input);
}

function getFeedsFiltered() {
    
    var input = {
        method : 'get',
        returnedContentType : 'xml',
        path : "rss.xml",
        transformation : {
            type : 'xslFile',
            xslFile : 'filtered.xsl'
        }
    };
     
    return WL.Server.invokeHttp(input);
}


/* -------------------------------------------------------------------------------------------------------------------- */


/* ------------------------------------------------- Form Based Authentication ---------------------------------------- */

function getSecretData(){
	/*
	 * The REST API works with all adapters and external resources, and is supported on the following hybrid environments: 
	 * iOS, Android, Windows Phone 8, Windows 8. 
	 * If your application supports other hybrid environments, see the tutorial for MobileFirst 6.3.
	 */
	var resourceRequest = new WLResourceRequest("/adapters/DummyAdapter/getSecretData", WLResourceRequest.GET);
	resourceRequest.send().then(
			getSecretData_CallbackOK,
			getSecretData_CallbackFail
	);
}

function getSecretData_CallbackOK(response){
	$("#ResponseDiv").html(JSON.stringify(response.responseJSON));
}

function getSecretData_CallbackFail(response){
	$("#ResponseDiv").html(JSON.stringify(response.responseJSON));
}

/* -------------------------------------------------------------------------------------------------------------------- */

/* ----------------------------------- Java Adapters(RSS Reader) ----------------------------------------- */

function loadFeeds(){
	busyIndicator.show();
	
	/*
	 * The REST API works with all adapters and external resources, and is supported on the following hybrid environments: 
	 * iOS, Android, Windows Phone 8, Windows 8. 
	 * If your application supports other hybrid environments, see the tutorial for MobileFirst 6.3.
	 */
	var resourceRequest = new WLResourceRequest("/adapters/RSSAdapter/", WLResourceRequest.GET);
	resourceRequest.setQueryParameter("topic", topic);
	resourceRequest.send().then(
			loadFeedsSuccess,
			loadFeedsFailure
	);
}


function loadFeedsSuccess(result){
	WL.Logger.debug("Feed retrieve success");
	busyIndicator.hide();
	WL.Logger.debug(JSON.stringify(result));
	if (result.responseJSON.rss.channel.item.length>0) 
		displayFeeds(result.responseJSON.rss.channel.item);
	else 
		loadFeedsFailure();
}

function loadFeedsFailure(result){
	WL.Logger.error("Feed retrieve failure");
	busyIndicator.hide();
	WL.SimpleDialog.show("RSS Reader", "Service not available. Try again later.", 
			[{
				text : 'Reload',
				handler : WL.Client.reloadApp 
			},
			{
				text: 'Close',
				handler : function() {}
			}]
		);
}

function displayFeeds(items){
	var ul = $('#itemsList');
	ul.empty();
	for (var i = 0; i < items.length; i++) {
		var li = $('<li/>').text(items[i].title);
		var pubDate = $('<div/>', {
			'class': 'pubDate'
		}).text(items[i].pubDate);

		li.append(pubDate);
		
		ul.append(li);
	}
}


/* ------------------------------------------------------------------------------------------------------- */

/* -------------------------------------------- Java Adapter(HTTP Request) --------------------------------------------- */

function getRate(){
	
	var req = new WLResourceRequest("/adapters/MyAdapter/API/convertCurrency/USD/EUR", WLResourceRequest.GET);
	req.send().then(function(resp){
		alert(resp.responseText);
	});
	
}
    


/* ------------------------------------------------------------------------------------------------------- */


/* --------------------------------------------- Push Notification --------------------------------------- */




function connectSuccess() {
	WL.Logger.debug ("Successfully connected to MobileFirst Server.");
}

function connectFailure() {
	WL.Logger.debug ("Failed connecting to MobileFirst Server.");
	WL.SimpleDialog.show("Push Notifications", "Failed connecting to MobileFirst Server. Try again later.", 
			[{
				text : 'Reload',
				handler : WL.Client.reloadapp
			},
			{
				text: 'Close',
				handler : function() {}
			}]
		);
}

function isPushSupported() {
	var isSupported = false;
	if (WL.Client.Push){
		isSupported = WL.Client.Push.isPushSupported();
	}	
	alert(isSupported);
}

function isPushSubscribed() {
	var isSubscribed = false;
	if (WL.Client.Push){
		isSubscribed = WL.Client.Push.isSubscribed('myPush');
	}
	alert(isSubscribed);
}

//---------------------------- Set up push notifications -------------------------------
if (WL.Client.Push) {	
	WL.Client.Push.onReadyToSubscribe = function() {
		alert("onReadyToSubscribe");
		
		$('#SubscribeButton').removeAttr('disabled');
		$('#UnsubscribeButton').removeAttr('disabled');

		WL.Client.Push.registerEventSourceCallback(
			"myPush", 
			"PushAdapter", 
			"PushEventSource", 
			pushNotificationReceived);
	};
}

// --------------------------------- Subscribe ------------------------------------
function doSubscribe() {
	WL.Client.Push.subscribe("myPush", {
		onSuccess: doSubscribeSuccess,
		onFailure: doSubscribeFailure
	});
}

function doSubscribeSuccess() {
	alert("doSubscribeSuccess");
}

function doSubscribeFailure() {
	alert("doSubscribeFailure");
}

//------------------------------- Unsubscribe ---------------------------------------
function doUnsubscribe() {
	WL.Client.Push.unsubscribe("myPush", {
		onSuccess: doUnsubscribeSuccess,
		onFailure: doUnsubscribeFailure
	});
}

function doUnsubscribeSuccess() {
	alert("doUnsubscribeSuccess");
}

function doUnsubscribeFailure() {
	alert("doUnsubscribeFailure");
}

//------------------------------- Handle received notification ---------------------------------------
function pushNotificationReceived(props, payload) {
	alert("pushNotificationReceived invoked");
	alert("props :: " + JSON.stringify(props));
	alert("payload :: " + JSON.stringify(payload));
}




/* ------------------------------------------------------------------------------------------------------- */

/* ---------------------------------------- Custom Device Provisioning ----------------------------------- */

function onConnectFailure(data){
	WL.SimpleDialog.show("Custom Device Provisioning", "Service not available. Try again later.", 
		[{
			text : 'Reload',
			handler : WL.Client.reloadApp 
		},
		{
			text: 'Close',
			handler : function() {}
		}]);
}


/* ------------------------------------------------------------------------------------------------------- */


/* ----------------------------------------- Location Services ------------------------------------------- */

//display the position to the user
function displayPosition(pos) {
	$('#longitude').html('<b>Longitude:</b> ' + pos.coords.longitude);
	$('#latitude').html('<b>Latitude:</b> ' + pos.coords.latitude);
	$('#timestamp').html('<b>Timestamp:</b> ' + new Date(pos.timestamp));
}

function alertOnGeoAcquisitionErr(geoErr) {
	alert('Error acquiring geolocation (' + geoErr.code + '): ' + geoErr.message);
}


function getFirstPositionAndTrack() {
	alert('Click OK to proceed to acquire starting position');

	// use GPS to get the user's location
	var geoPolicy = WL.Device.Geo.Profiles.LiveTracking();
	geoPolicy.timeout = 60000; // set timeout to 1 minute
	geoPolicy.maximumAge = 10000; // allow to use a position that is 10 seconds old
	
	// note: to see at high-accuracy, change RoughTracking above to LiveTracking
	
	// get the user's current position
	WL.Device.Geo.acquirePosition(
			function(pos) {
				// when we receive the position, we display it and start on-going acquisition
				displayPosition(pos);
				
				
				var triggers = {
					Geo: {
						posChange: { // display all movement
							type: "PositionChange",
							callback: function(deviceContext) {
									displayPosition(deviceContext.Geo);
								}
						},
						
						leftArea: { // alert when we have left the area
							type: "Exit",
							circle: {
								longitude: pos.coords.longitude,
								latitude: pos.coords.latitude,
								radius: 200
							},
							callback: function() {
								alert('Left the area');
								WL.Client.transmitEvent({ event: 'exit area'}, true);
							}
						},
						
						dwellArea: { // alert when we have stayed in the vicinity for 3 seconds
							type: "DwellInside",
							circle: {
								longitude: pos.coords.longitude,
								latitude: pos.coords.latitude,
								radius: 50
							},
							dwellingTime: 3000,
							callback: function() {
								alert('Still in the vicinity');
								WL.Client.transmitEvent({ event: 'dwell inside area'}, true);
							}
						}
					}	
				};
				
				WL.Device.startAcquisition({ Geo: geoPolicy }, triggers, { Geo: alertOnGeoAcquisitionErr } );
			},
			function(geoErr) {
				alertOnGeoAcquisitionErr(geoErr);
				// try again:
				getFirstPositionAndTrack();
			},
			geoPolicy
		); 
}

function onConnectSuccess(){
	// start up acquisition process
	getFirstPositionAndTrack();

}

function onConnectFailure(){
	WL.SimpleDialog.show("Location Services", "Failed connecting to MobileFirst server. Try again later.", 
			[{
				text : 'Reload',
				handler : WL.Client.reloadApp
			},
			{
				text: 'Close',
				handler : function() {}
			}]
		);
}

function wlCommonInit(){
	// Common initialization code goes here
	WL.Client.connect({
		onSuccess: onConnectSuccess,
		onFailure: onConnectFailure
	});
	
	// keep running while in background on Android; will show a notification
	WL.App.setKeepAliveInBackground(true);
}


/* ------------------------------------------------------------------------------------------------------- */