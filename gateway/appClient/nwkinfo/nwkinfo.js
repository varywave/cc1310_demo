/******************************************************************************

 @file nwkinfo.js

 @brief network information specific functions

 Group: WCS LPC
 $Target Devices: Linux: AM335x, Embedded Devices: CC1310, CC1350, CC1352$

 ******************************************************************************
 $License: BSD3 2016 $
  
   Copyright (c) 2015, Texas Instruments Incorporated
   All rights reserved.
  
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:
  
   *  Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
  
   *  Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
  
   *  Neither the name of Texas Instruments Incorporated nor the names of
      its contributors may be used to endorse or promote products derived
      from this software without specific prior written permission.
  
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
   THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
   PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
   OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
   WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
   OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************
 $Release Name: TI-15.4Stack Linux x64 SDK$
 $Release Date: Sept 27, 2017 (2.03.00.06)$
 *****************************************************************************/

var util = require('util');
var protobuf = require("protocol-buffers");
var fs = require("fs");

/* set-up to decode/encode proto messages */
var ntimac_pb = protobuf(fs.readFileSync('appClient/protofiles/appsrv.proto'));

/*!
 * @brief      Constructor for network Information object
 *
 * @param      networkInfo - object with network information
 *
 * @retun      network information object
 */
function NwkInfo(networkInfo) {
    var nwkInfo = this;
    return createNwkInfoObj(networkInfo);
    function createNwkInfoObj(networkInfo) {
        /* set network mode */

        nwkInfo.fh = networkInfo.nwkinfo.nwkInfo.fh;
        /* set network channel information */
        nwkInfo.channel = networkInfo.nwkinfo.nwkInfo.channel;
        /* set the PAN Coordinator device informatoin */
        nwkInfo.panCoord = {
            panId: networkInfo.nwkinfo.nwkInfo.devInfo.panID,
            shortAddress: networkInfo.nwkinfo.nwkInfo.devInfo.shortAddress,
            extAddress: networkInfo.nwkinfo.nwkInfo.devInfo.extAddress
        };
        /* set the security information */
        nwkInfo.securityEnabled = networkInfo.nwkinfo.securityEnabled;
        /* set network mode */
        if (networkInfo.nwkinfo.networkMode == ntimac_pb.nwkMode.BEACON_ENABLED) {
            nwkInfo.networkMode = "Beacon Enabled"
        }
        else if (networkInfo.nwkinfo.networkMode == ntimac_pb.nwkMode.NON_BEACON) {
            nwkInfo.networkMode = "Non Beacon";
        }
        else if (networkInfo.nwkinfo.networkMode == ntimac_pb.nwkMode.FREQUENCY_HOPPING) {
            nwkInfo.networkMode = "Freq Hopping";
        }
        else {
            nwkInfo.networkMode = "Unknown Mode"
        }
        /* set network state */
        switch (networkInfo.nwkinfo.state) {
            case ntimac_pb.Cllc_states.Cllc_states_initWaiting:
                /* Application is waiting for user input
                to start the application */
                nwkInfo.state = "waiting";
                break;
            case ntimac_pb.Cllc_states.Cllc_states_startingCoordinator:
                /* Application is working to start the network */
                nwkInfo.state = "starting";
                break;
            case ntimac_pb.Cllc_states.Cllc_states_initRestoringCoordinator:
                /* Application is working to restore the network
                from previously stored informatoin */
                nwkInfo.state = "restoring";
                break;
            case ntimac_pb.Cllc_states.Cllc_states_started:
            case ntimac_pb.Cllc_states.Cllc_states_restored:
                /* Network is started */
                nwkInfo.state = "started";
                break;
            case ntimac_pb.Cllc_states.Cllc_states_joiningAllowed:
                /* Network is open for new devices to join */
                nwkInfo.state = "open";
                break;
            case ntimac_pb.Cllc_states.Cllc_states_joiningNotAllowed:
                /* Network is closed for new devices to join */
                nwkInfo.state = "close";
                break;
            default:
                /* Should not get here */
                console.log("ERROR: rcvd illegal coord state(NwkInfo)");
                nwkInfo.state = "unknown";
                break;
        }
        return nwkInfo;
    }
}

/* update network information */
NwkInfo.prototype.updateNwkInfo = function (networkInfo) {
    var self = this;
    self.fh = networkInfo.nwkinfo.nwkInfo.fh;
    /* set network channel information */
    self.channel = networkInfo.nwkinfo.nwkInfo.channel;
    /* set the PAN Coordinator device informatoin */
    self.panCoord = {
        panId: networkInfo.nwkinfo.nwkInfo.devInfo.panID,
        shortAddress: networkInfo.nwkinfo.nwkInfo.devInfo.shortAddress,
        extAddress: networkInfo.nwkinfo.nwkInfo.devInfo.extAddress
    };
    self.securityEnabled = networkInfo.nwkinfo.securityEnabled;
    self.networkMode = networkInfo.nwkinfo.networkMode;
    /* set network state */
    switch (networkInfo.nwkinfo.state) {
        case ntimac_pb.Cllc_states.Cllc_states_initWaiting:
            /* Application is waiting for user input
            to start the application */
            self.state = "waiting";
            break;
        case ntimac_pb.Cllc_states.Cllc_states_startingCoordinator:
            /* Application is working to start the network */
            self.state = "starting";
            break;
        case ntimac_pb.Cllc_states.Cllc_states_initRestoringCoordinator:
            /* Application is working to restore the network
            from previously stored informatoin */
            self.state = "restoring";
            break;
        case ntimac_pb.Cllc_states.Cllc_states_started:
        case ntimac_pb.Cllc_states.Cllc_states_restored:
            /* Network is started */
            self.state = "started";
            break;
        case ntimac_pb.Cllc_states.Cllc_states_joiningAllowed:
            /* Network is open for new devices to join */
            self.state = "open";
            break;
        case ntimac_pb.Cllc_states.Cllc_states_joiningNotAllowed:
            /* Network is closed for new devices to join */
            self.state = "close";
            break;
        default:
            /* Should not get here */
            console.log("ERROR: rcvd illegal coord state(networkInfo)");
            self.state = "unknown";
            break;
    }
}

/* update network state */
NwkInfo.prototype.updateNwkState = function (nState) {
    var self = this;
    /* set network state */
    switch (nState.state) {
        case ntimac_pb.Cllc_states.Cllc_states_initWaiting:
            /* Application is waiting for user input
            to start the application */
            self.state = "waiting";
            break;
        case ntimac_pb.Cllc_states.Cllc_states_startingCoordinator:
            /* Application is working to start the network */
            self.state = "starting";
            break;
        case ntimac_pb.Cllc_states.Cllc_states_initRestoringCoordinator:
            /* Application is working to restore the network
            from previously stored informatoin */
            self.state = "restoring";
            break;
        case ntimac_pb.Cllc_states.Cllc_states_started:
        case ntimac_pb.Cllc_states.Cllc_states_restored:
            /* Network is started */
            self.state = "started";
            break;
        case ntimac_pb.Cllc_states.Cllc_states_joiningAllowed:
            /* Network is open for new devices to join */
            self.state = "open";
            break;
        case ntimac_pb.Cllc_states.Cllc_states_joiningNotAllowed:
            /* Network is closed for new devices to join */
            self.state = "close";
            break;
        default:
            /* Should not get here */
            console.log("ERROR: rcvd illegal coord state(nState)");
            self.state = "unknown";
            break;
    }
}

module.exports = NwkInfo;
