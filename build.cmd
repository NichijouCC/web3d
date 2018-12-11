@echo build web3d
@cd src
@call tsc

@echo build usercode
@cd ../code
@call tsc

@echo build gamestart
REM @cd ../jsloader
REM @call tsc

@cd ../gamestart
@call tsc

REM @echo mix up
REM @cd ../lib
REM @call uglifyjs web3d.js -m  -o web3d.min.js

@echo build done.

