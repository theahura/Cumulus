/**
@author: Amol Kapoor
@date: 7-7-15
@version: 0.1

Global config location for all multi-file-wide files (client side)
*/

//Connection to Backend
var socket = io('http://54.86.173.127:5000');

//Account info from login
var global_userKey = "";

//APIs
var global_baseAPI = null;
var global_googleAPI = null;
