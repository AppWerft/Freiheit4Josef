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
    goog.provide('Apiomat.Nutzer');
    goog.require('Apiomat.User');
    goog.require('Apiomat.Audio');
    goog.require('Apiomat.Photo');
}
if(typeof exports === 'undefined')
{
    var Apiomat = Apiomat || {};
}
(function(Apiomat)
{
Apiomat.Nutzer = function() {
    this.data = new Object();
    this.data["dynamicAttributes"] = {};
    
    this.initDatastoreWithMembersCredentialsIfNeeded = function() {
        //if the datastore is not initialized then do so
        if(Apiomat.Datastore.getInstance().getUsername() == undefined && Apiomat.Datastore.getInstance().getPassword() == undefined) {
            if(this.getUserName() != undefined && this.getPassword() != undefined) {
                Apiomat.Datastore.configure(this);
            } else {
                throw new Error("Please set userName and password first for member!");
            }
        }
    };
    
    /* override save function */
    this.save = function(_callback) {
        this.initDatastoreWithMembersCredentialsIfNeeded();
        Apiomat.AbstractClientDataModel.prototype.save.apply(this, [_callback]);
    };

    /* Requests a new password; user will receive an email to confirm*/
    this.requestNewPassword = function() {
        var callback = {
            onOk : function(refHref) {
            },
            onError : function(error) {
            }
        };
        Apiomat.Datastore.getInstance().postOnServer(this, callback, "models/requestResetPassword/" );
    };
    
    /**
    * Reset password 
    * @param newPassword the new password
    */
    this.resetPassword = function(newPassword, _callback) {
        var internCallback = {
            onOk : function() {
                this.parent.setOffline(this.wasLocalSave || false);
                Apiomat.Datastore.configure(this.parent);
                if (_callback && _callback.onOk)
                {
                    _callback.onOk();
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
        };
        internCallback.parent = this;
        this.setPassword( newPassword );
        if(Apiomat.Datastore.getInstance().shouldSendOffline("PUT"))
        {
            internCallback.wasLocalSave = true;
            Apiomat.Datastore.getInstance( ).sendOffline( "PUT", this.getHref(), this, undefined, internCallback );
        }
        else
        {
            Apiomat.Datastore.getInstance().updateOnServer(this, internCallback);
        }
    };
    /* referenced object methods */
    
    var myAudios = [];
    
    this.getMyAudios = function() 
    {
        return myAudios;
    };
    
    this.loadMyAudios = function(query,callback) 
    {
        var refUrl = this.data.myAudiosHref;
        Apiomat.Datastore.getInstance().loadFromServer(refUrl, {
            onOk : function(obj) {
                myAudios = obj;
                callback.onOk();
            },
            onError : function(error) {
                callback.onError(error);
            }
        }, undefined, query, Apiomat.Audio);
    };
    
    this.postMyAudios = function(_refData, _callback) 
    {
        if(_refData == false || typeof _refData.getHref() === 'undefined') {
            var error = new Apiomat.ApiomatRequestError(Apiomat.Status.SAVE_REFERENECE_BEFORE_REFERENCING);
            if (_callback && _callback.onError) {
                    _callback.onError(error);
            } else if(console && console.log) {
                    console.log("Error occured: " + error);
            }
            return;
        }
        var callback = {
            onOk : function(refHref) {
                if (refHref) {
                                    /* only add reference data if not already in local list */
                    if(myAudios.filter(function(_elem) {
                        return _elem.getHref() && refHref && _elem.getHref() === refHref;
                    }).length < 1)
                    {
                        myAudios.push(_refData);
                    } 
                                }
                if (_callback && _callback.onOk) {
                    _callback.onOk();
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
        };
         if(Apiomat.Datastore.getInstance().shouldSendOffline("POST"))
        {
            Apiomat.Datastore.getInstance( ).sendOffline( "POST", this.getHref(), _refData, "myAudios", callback );
        }
        else
        {
            Apiomat.Datastore.getInstance().postOnServer(_refData, callback, this.data.myAudiosHref);
        }
    };
    
    this.removeMyAudios = function(_refData, _callback) 
    {
        var id = _refData.getHref().substring(_refData.getHref().lastIndexOf("/") + 1);
        var deleteHref = this.data.myAudiosHref + "/" + id;
        var callback = {
            onOk : function(obj) {
                            /* Find and remove reference from local list */
                var i = myAudios.indexOf(_refData);
                if(i != -1) {
                    myAudios.splice(i, 1);
                }
            ;                 
                if (_callback && _callback.onOk) {
                    _callback.onOk();
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
        };
        Apiomat.Datastore.getInstance().deleteOnServer(deleteHref, callback);
    };    
    
    var myPhotos = [];
    
    this.getMyPhotos = function() 
    {
        return myPhotos;
    };
    
    this.loadMyPhotos = function(query,callback) 
    {
        var refUrl = this.data.myPhotosHref;
        Apiomat.Datastore.getInstance().loadFromServer(refUrl, {
            onOk : function(obj) {
                myPhotos = obj;
                callback.onOk();
            },
            onError : function(error) {
                callback.onError(error);
            }
        }, undefined, query, Apiomat.Photo);
    };
    
    this.postMyPhotos = function(_refData, _callback) 
    {
        if(_refData == false || typeof _refData.getHref() === 'undefined') {
            var error = new Apiomat.ApiomatRequestError(Apiomat.Status.SAVE_REFERENECE_BEFORE_REFERENCING);
            if (_callback && _callback.onError) {
                    _callback.onError(error);
            } else if(console && console.log) {
                    console.log("Error occured: " + error);
            }
            return;
        }
        var callback = {
            onOk : function(refHref) {
                if (refHref) {
                                    /* only add reference data if not already in local list */
                    if(myPhotos.filter(function(_elem) {
                        return _elem.getHref() && refHref && _elem.getHref() === refHref;
                    }).length < 1)
                    {
                        myPhotos.push(_refData);
                    } 
                                }
                if (_callback && _callback.onOk) {
                    _callback.onOk();
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
        };
         if(Apiomat.Datastore.getInstance().shouldSendOffline("POST"))
        {
            Apiomat.Datastore.getInstance( ).sendOffline( "POST", this.getHref(), _refData, "myPhotos", callback );
        }
        else
        {
            Apiomat.Datastore.getInstance().postOnServer(_refData, callback, this.data.myPhotosHref);
        }
    };
    
    this.removeMyPhotos = function(_refData, _callback) 
    {
        var id = _refData.getHref().substring(_refData.getHref().lastIndexOf("/") + 1);
        var deleteHref = this.data.myPhotosHref + "/" + id;
        var callback = {
            onOk : function(obj) {
                            /* Find and remove reference from local list */
                var i = myPhotos.indexOf(_refData);
                if(i != -1) {
                    myPhotos.splice(i, 1);
                }
            ;                 
                if (_callback && _callback.onOk) {
                    _callback.onOk();
                }
            },
            onError : function(error) {
                if (_callback && _callback.onError) {
                    _callback.onError(error);
                }
            }
        };
        Apiomat.Datastore.getInstance().deleteOnServer(deleteHref, callback);
    };    
};
/* static constants */
Apiomat.Nutzer.AOMBASEURL = "https://apiomat.org/yambas/rest/apps/FreeJosef";
Apiomat.Nutzer.AOMAPIKEY = "7462535499043681208";
Apiomat.Nutzer.AOMSYS = "LIVE";
Apiomat.Nutzer.AOMSDKVERSION = "1.11-113";
/* static methods */

/**
* Returns a list of objects of this class from server.
*
* If query is given than returend list will be filtered by the given query
*
* @param query (optional) a query filtering the results in SQL style (@see <a href="http://doc.apiomat.com">documentation</a>)
* @param withReferencedHrefs set to true to get also all HREFs of referenced models
*/
Apiomat.Nutzer.getNutzers = function(query, callback) {
    Apiomat.Datastore.getInstance().loadListFromServerWithClass(Apiomat.Nutzer, query, callback);
};

/* inheritance */
Apiomat.Nutzer.prototype = new Apiomat.User();
Apiomat.Nutzer.prototype.constructor = Apiomat.Nutzer;

/**
* Updates this class from server.
* Be sure that userName and password is set
*/
Apiomat.Nutzer.prototype.loadMe = function(callback) {
    this.initDatastoreWithMembersCredentialsIfNeeded();
    Apiomat.Datastore.getInstance().loadFromServer("models/me", callback, this);
};

Apiomat.Nutzer.prototype.getSimpleName = function() {
    return "Nutzer";
};

Apiomat.Nutzer.prototype.getModuleName = function() {
    return "FreeJosefMain";
};

/* easy getter and setter */

   Apiomat.Nutzer.prototype.getLocationLatitude = function() 
{
    var locArr = this.data.location;
    if(locArr)
    {
        return locArr[0];
    }
};

Apiomat.Nutzer.prototype.getLocationLongitude = function() 
{
    var locArr = this.data.location;
    if(locArr)
    {
        return locArr[1];
    }
};

Apiomat.Nutzer.prototype.setLocationLatitude = function(_latitude) 
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

Apiomat.Nutzer.prototype.setLocationLongitude = function(_longitude) 
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

        Apiomat.Nutzer.prototype.getMyAudios = function() 
{
    return this.data.myAudios;
};

Apiomat.Nutzer.prototype.setMyAudios = function(_myAudios) {
    this.data.myAudios = _myAudios;
};

        Apiomat.Nutzer.prototype.getMyPhotos = function() 
{
    return this.data.myPhotos;
};

Apiomat.Nutzer.prototype.setMyPhotos = function(_myPhotos) {
    this.data.myPhotos = _myPhotos;
};
})(typeof exports === 'undefined' ? Apiomat
        : exports);