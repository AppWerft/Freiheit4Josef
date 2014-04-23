/*
 * Copyright (c) 2011-2013, Apinauten GmbH
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice, this 
 *    list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice, 
 *    this list of conditions and the following disclaimer in the documentation 
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * THIS FILE IS GENERATED AUTOMATICALLY. DON'T MODIFY IT.
 */
 
/* define namespace */

if(typeof goog !== 'undefined')
{
    goog.provide('Apiomat.Audio');
    goog.require('Apiomat.AbstractClientDataModel');
}
if(typeof exports === 'undefined')
{
    var Apiomat = Apiomat || {};
}
(function(Apiomat)
{
Apiomat.Audio = function() {
    this.data = new Object();
    /* referenced object methods */
};
/* static methods */

/**
* Returns a list of objects of this class from server.
*
* If query is given than returend list will be filtered by the given query
*
* @param query (optional) a query filtering the results in SQL style (@see <a href="http://doc.apiomat.com">documentation</a>)
* @param withReferencedHrefs set to true to get also all HREFs of referenced models
*/
Apiomat.Audio.getAudios = function(query, callback) {
    Apiomat.Datastore.getInstance().loadListFromServerWithClass(Apiomat.Audio, query, callback);
};

/* inheritance */
Apiomat.Audio.prototype = new Apiomat.AbstractClientDataModel();
Apiomat.Audio.prototype.constructor = Apiomat.Audio;


Apiomat.Audio.prototype.getSimpleName = function() {
    return "Audio";
};

Apiomat.Audio.prototype.getModuleName = function() {
    return "FreeJosefMain";
};

/* easy getter and setter */

   Apiomat.Audio.prototype.getLocationLatitude = function() 
{
    var locArr = this.data.location;
    if(locArr)
    {
        return locArr[0];
    }
};

Apiomat.Audio.prototype.getLocationLongitude = function() 
{
    var locArr = this.data.location;
    if(locArr)
    {
        return locArr[1];
    }
};

Apiomat.Audio.prototype.setLocationLatitude = function(_latitude) 
{
    var locArr = this.data.location;
    if(!locArr)
    {
        locArr = [_latitude, undefined];
    }
    else
    {
        locArr[0] = _latitude;
    }
    this.data.location = locArr;
};

Apiomat.Audio.prototype.setLocationLongitude = function(_longitude) 
{
    var locArr = this.data.location;
    if(!locArr)
    {
        locArr = [0, _longitude];
    }
    else
    {
        locArr[1] = _longitude;
    }
    this.data.location = locArr;
};

    /**
 * Returns an URL of the file.  * @return the URL of the file
 */
Apiomat.Audio.prototype.getRecordURL = function() 
{
    var url = this.data.recordURL;
    if(!url)
    {
        return undefined;
    }
    url += ".img?apiKey=" + Apiomat.User.AOMAPIKEY + "&system=" + Apiomat.User.AOMSYS;
    return url;
}

Apiomat.Audio.prototype.loadRecord = function(_callback)
{
    var resUrl = this.getRecordURL();
    return Apiomat.Datastore.getInstance().loadResource(resUrl, _callback);
}

Apiomat.Audio.prototype.postRecord = function(_data, _callback) 
{
    var postCB = {
            onOk : function(_imgHref) {
                if (_imgHref) {
                    this.parent.data.recordURL = _imgHref;
                    /* update model again */
                    this.parent.save({
                        onOk : function() {
                            if (_callback && _callback.onOk) {
                                _callback.onOk();
                            }           
                        },
                        onError : function(error) {
                            if (_callback && _callback.onError) {
                                _callback.onError(error);
                            }
                        }
                    });
                }
                else {
                    var error = new Apiomat.ApiomatRequestError(Apiomat.Status.HREF_NOT_FOUND);
                    if (_callback && _callback.onError) {
                        _callback.onError(error);
                    } else if(console && console.log) {
                        console.log("Error occured: " + error);
                    }
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
    };
    postCB.parent = this;
    if(Apiomat.Datastore.getInstance().shouldSendOffline("POST"))
    {
        Apiomat.Datastore.getInstance( ).sendOffline( "POST", null, _data, false, postCB );
    }
    else
    {
        Apiomat.Datastore.getInstance().postStaticDataOnServer(_data, false, postCB);
    }
};

Apiomat.Audio.prototype.deleteRecord = function(_callback) 
{
    var imageHref = this.data.recordURL;

    var deleteCB = {
        onOk : function() {
            delete this.parent.data.recordURL;
            /* update model again and save deleted image reference in model */
            this.parent.save({
                onOk : function() {
                    if (_callback && _callback.onOk) {
                        _callback.onOk();
                    }           
                },
                onError : function(error) {
                    if (_callback && _callback.onError) {
                        _callback.onError(error);
                    }
                }
            });
        },
        onError : function(error) {
            if (_callback && _callback.onError) {
                _callback.onError(error);
            }
        }
    };
    deleteCB.parent = this;
    if(Apiomat.Datastore.getInstance().shouldSendOffline("DELETE"))
    {
        Apiomat.Datastore.getInstance( ).sendOffline( "DELETE", imageHref, null, null, deleteCB );
    }
    else
    {
        Apiomat.Datastore.getInstance().deleteOnServer(imageHref, deleteCB);
    }
};

        Apiomat.Audio.prototype.getTitle = function() 
{
    return this.data.title;
};

Apiomat.Audio.prototype.setTitle = function(_title) {
    this.data.title = _title;
};
})(typeof exports === 'undefined' ? Apiomat
        : exports);