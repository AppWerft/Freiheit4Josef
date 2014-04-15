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
    
    var myphotos = [];
    
    this.getMyphotos = function() 
    {
        return myphotos;
    };
    
    this.loadMyphotos = function(query,callback) 
    {
        var refUrl = this.data.myphotosHref;
        Apiomat.Datastore.getInstance().loadFromServer(refUrl, {
            onOk : function(obj) {
                myphotos = obj;
                callback.onOk();
            },
            onError : function(error) {
                callback.onError(error);
            }
        }, undefined, query, Apiomat.Photo);
    };
    
    this.postMyphotos = function(_refData, _callback) 
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
                    if(myphotos.filter(function(_elem) {
                        return _elem.getHref() && refHref && _elem.getHref() === refHref;
                    }).length < 1)
                    {
                        myphotos.push(_refData);
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
            Apiomat.Datastore.getInstance( ).sendOffline( "POST", this.getHref(), _refData, "myphotos", callback );
        }
        else
        {
            Apiomat.Datastore.getInstance().postOnServer(_refData, callback, this.data.myphotosHref);
        }
    };
    
    this.removeMyphotos = function(_refData, _callback) 
    {
        var id = _refData.getHref().substring(_refData.getHref().lastIndexOf("/") + 1);
        var deleteHref = this.data.myphotosHref + "/" + id;
        var callback = {
            onOk : function(obj) {
                            /* Find and remove reference from local list */
                var i = myphotos.indexOf(_refData);
                if(i != -1) {
                    myphotos.splice(i, 1);
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
Apiomat.Nutzer.AOMBASEURL = "https://apiomat.org/yambas/rest/apps/Josef0";
Apiomat.Nutzer.AOMAPIKEY = "6959609056717720206";
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
    return "Josef0Main";
};

/* easy getter and setter */

        Apiomat.Nutzer.prototype.getMyphotos = function() 
{
    return this.data.myphotos;
};

Apiomat.Nutzer.prototype.setMyphotos = function(_myphotos) {
    this.data.myphotos = _myphotos;
};
})(typeof exports === 'undefined' ? Apiomat
        : exports);