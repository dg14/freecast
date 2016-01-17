/*******************************************************************************
 * 
 * Copyright (c) 2015 Louay Bassbouss, Fraunhofer FOKUS, All rights reserved.
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3.0 of the License, or (at your option) any later version.
 * 
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>. 
 * 
 * AUTHORS: Louay Bassbouss (louay.bassbouss@fokus.fraunhofer.de)
 *
 ******************************************************************************/
var dial = require("peer-dial");
var http = require('http');
var express = require('express');
var opn = require("opn");
var app = express();
var server = http.createServer(app);
//var nw=require('nw');
var gui = null;

var PORT = 3000;
var MANUFACTURER = "Fraunhofer FOKUS";
var MODEL_NAME = "DIAL Demo Server";

function gotoURL(aa) {
//        console.log(win.Window);
//        var win=gui.Window.get();
//        win.open(aa);
//        console.log(window.location.href);
        window.location.href=aa;
}

var apps = {
	"YouTube": {
		name: "YouTube",
		state: "stopped",
		allowStop: true,
		pid: null,
        /*
        additionalData: {
            "ex:key1":"value1",
            "ex:key2":"value2"
        },
        namespaces: {
           "ex": "urn:example:org:2014"
        }*/
        launch: function (launchData) {
                //opn("http://www.youtube.com/tv?"+launchData);
                console.log("LAUNCHING YOUTUBE");
                gotoURL("http://www.youtube.com/tv?"+launchData);
        }
	}
};
var dialServer = new dial.Server({
	expressApp: app,
	port: PORT,
        prefix: "/dial",
	manufacturer: MANUFACTURER,
	modelName: MODEL_NAME,
	delegate: {
		getApp: function(appName){
			var app = apps[appName];
			return app;
		},
		launchApp: function(appName,lauchData,callback){
			console.log("Got request to launch", appName," with launch data: ", lauchData);
			var app = apps[appName];
			var pid = null;
			if (app) {
				app.pid = "run";
				app.state = "starting";
                app.launch(lauchData);
                app.state = "running";
			}
			callback(app.pid);
		},
		stopApp: function(appName,pid,callback){
            console.log("Got request to stop", appName," with pid: ", pid);
			var app = apps[appName];
			if (app && app.pid == pid) {
				app.pid = null;
				app.state = "stopped";
				callback(true);
			} 
			else {
				callback(false);
			}
		}
	}
});
        
exports.startApp = function() {
        server.listen(PORT,function(){
	        dialServer.start();
        	// dialServer.stop();
        	console.log("DIAL Server is running on PORT "+PORT);
        	});
}