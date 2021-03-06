
/*
Copyright (c) 2014, Groupon, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

Neither the name of GROUPON nor the names of its contributors may be
used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var download, parseHashes;

download = require('download');

parseHashes = function(rawHash) {
  var hashes, parse;
  parse = function(result, hash) {
    var key, parts, value;
    parts = hash.trim().split('=');
    key = parts[0];
    value = parts.splice(1).join('=');
    result[key] = value;
    return result;
  };
  hashes = rawHash.split(',');
  return hashes.reduce(parse, {});
};

module.exports = function(url, destinationDir, fileName, callback) {
  var fileOptions, hash, stream;
  hash = null;
  fileOptions = {
    url: url,
    name: fileName
  };
  stream = download(fileOptions, destinationDir);
  stream.on('response', function(response) {
    var rawHash;
    rawHash = response.headers['x-goog-hash'];
    return hash = parseHashes(rawHash).md5;
  });
  stream.on('error', function(error) {
    return callback(error);
  });
  return stream.on('close', function() {
    return callback(null, hash);
  });
};
