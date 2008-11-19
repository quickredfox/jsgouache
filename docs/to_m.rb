#!/usr/bin/env ruby -wKU -ropen-uri 
require 'rubygems'
require 'clothred'

main = open('files/JsGouache-js.html').read

c = ClothRed.new(main)

p c.to_textile