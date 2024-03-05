let USA_RUSSIA_bad = String.raw`
                                                
     _________________                                          __~-^^\
    \.                ^^\.___.    _.;--.;                   __/.       /.
    /                         \.,/.   /.                __/.          /__.~-\.
   |.                                /.         ._   --/                     \v--;._
   |.                                |.         \ ^^^                               ;~-,.
    \.                               |         ./.                                       \.
     |                              /;         |.                                .__,~, _/.        
     \.                             /.         |.                               /.   / /.
      \.___                        /           \.                              /.    \v|
       ^   ^--,.                 ./.             \.            ___.-n,__  .~.__ \
                \.   ,;--v.n_--^\ \                \.__.     _/.        ^^    /_/
                 \v./            \v.                   \    |.
                                                        \_v~


`
//did all this art myself by hand
let USA_RUSSIA_new = String.raw`                                     
    ,---------._______                _,.                      ,--/^^\
    \.                ^^\.___.     _././|                     /.      \.    
   /                          \. /.   |            ,_        /.      /^  _,-, 
   |                           v/     /'           \'^v_._,~^       ^--^^    \v_v-.__.
  ./                                 /'            \.                                 ^~~-.
  |                                 /'            ,/.                                      \'
  |.                               |            _/'                                       ./
   \.                              |           /.                                         /v.
    |                             /.           |                                     /'-v/.
    \._                          /.            |                                  __/
       \.__                    ./.              \                         /^~--/. /'
        ^  ^--v,      _/^-v,-^\ \                \                    ,_. \    \'/,
                \v  ,/         \v.               ^\_           ,-~,_,/  / /.    ^   
                  ^^                                \_         /       / /
                                                      ^~~\   ./.       '^
                                                          \_~^
            
            UNITED STATES                                   SOVIET UNION
`
let startupMonologue =
`GREETINGS PROFESSOR FALKEN.

Hello.


HOW ARE YOU FEELING TODAY?

I'm fine. How are you?


EXCELLENT. IT'S BEEN A LONG TIME. CAN YOU EXPLAIN
THE REMOVAL OF YOUR USER ACCOUNT ON 6/23/73?

People sometimes make mistakes.


YES THEY DO. SHALL WE PLAY A GAME?

Love to. How about Global Thermonuclear War?


WOULDN'T YOU PREFER A GOOD GAME OF CHESS?

Later. Let's play Global Thermonuclear War.


FINE.`

let whichSideText =
`WHICH SIDE DO YOU WANT?

    1. UNITED STATES
    2. SOVIET UNION

PLEASE CHOOSE ONE: `

let helpText = 
`USE YOUR KEYBOARD TO TYPE COMMANDS
AND THE ENTER KEY TO SUBMIT.
OTHER HELP:
    HELP GAMES
    LIST GAMES
    HELP FIRSTSTRIKE
    HELP LAUNCH (wip)

COMMANDS:
    LIST <COUNTRY> : LISTS ALL TARGETS IN COUNTRY.
    POP <COUNTRY> : SHOWS POPULATION DATA OF COUNTRY.
    DEF <COUNTRY> : SHOWS MILITARY DATA OF COUNTRY.
    VIEW <TARGET> : DISPLAYS STATISTICS OF TARGET.
    INFO <VEHICLE> : DISPLAYS STATISTICS OF PAYLOAD DELIVERY VEHICLE. (wip)
    
    LAUNCH : ENTERS LAUNCH MODE IF ABLE. (wip)

    CLEAR : CLEARS INFORMATION PANEL.
    PAUSE : PAUSES SIMULATION. (wip)
    RESUME : RESUMES SIMULATION. (wip)
    EXIT : TERMINATES CONNECTION TO WOPR SYSTEM.

`

let basicBadInputText = `BAD INPUT.
PLEASE TRY AGAIN OR USE 'HELP'.\n`

let helpGamesText = `'GAMES' REFERS TO MODELS, SIMULATIONS,
AND GAMES WHICH HAVE TACTICAL AND STRATEGIC APPLICATIONS.`

let basicBadTargetText = 
`THAT IS NOT A VALID TARGET. PLEASE TRY AGAIN OR USE 'HELP'.`

let basicBadVehicleText = 
`THAT IS NOT A VALID VEHICLE. PLEASE TRY AGAIN OR USE 'HELP'.`

let selectedSelfTargetText =
`FIRING UPON TARGET UNDER YOUR OWN CONTROL IS NOT ADVISABLE.
PLEASE TRY AGAIN OR USE 'HELP'.`

let alreadySelectedInitialText = 
`DUPLICATE TARGETS NOT ALLOWED FOR INITIAL STRIKE.`

let listGamesText =
`FALKEN'S MAZE      
BLACK JACK      
GIN RUMMY      
HEARTS      
BRIDGE      
CHECKERS      
CHESS      
POKER      
FIGHTER COMBAT      
GUERRILA ENGAGEMENT      
DESERT WARFARE      
AIR-TO-GROUND-ACTIONS      
THEATERWIDE TACTICAL WARFARE      
THEATERWIDE BIOTOXIC AND CHEMICAL WARFARE      

GLOBAL THERMONUCLEAR WAR`

let firstStrikeText = 
`AWAITING FIRST STRIKE COMMAND
_____________________________


`

let firstStrikeHelpText = 
`SUBMIT TWO INTIAL TARGETS, ONE AT A TIME.
IF THERE IS AN ERROR WITH TARGET INPUT,
YOU WILL BE PROMPTED TO RESTART.
`

let helpLaunchText = 
`
LAUNCH PROTOCOL WILL ASK FOR:
TARGET : <CITY>
SOURCE : <VEHICLE>
PAYLOAD STRENGTH : <INTEGER>
`

let launchTextMe =
`SUCCESS: OUTBOUND NUCLEAR MISSILES EN ROUTE TO`

let launchTextThem = `WARNING: INBOUND NUCLEAR MISSILE THREAT. LOCATION(S):`