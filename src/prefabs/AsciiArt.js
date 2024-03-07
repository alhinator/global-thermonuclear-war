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
^v,.                                                  ^~~\   ./.       '^
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
`USE KEYBOARD TO TYPE COMMANDS AND ENTER KEY TO SUBMIT.
OTHER HELP:
    HELP GAMES | LIST GAMES
    HELP FIRSTSTRIKE
    HELP LAUNCH

COMMANDS:
    TOGGLE : TOGGLES CITY VISIBILITY ON MAP.
    LAUNCH : ENTERS LAUNCH MODE IF ABLE. ONLY AVAILABLE
        AFTER FIRST STRIKE COMMAND.
    CLEAR : CLEARS INFORMATION PANEL.
    PAUSE : PAUSES SIMULATION.
    RESUME : RESUMES SIMULATION.
    EXIT : TERMINATES CONNECTION TO WOPR SYSTEM.
COMMANDS WITH <ARGUMENT>:
    LIST <COUNTRY> : LISTS ALL TARGETS IN COUNTRY.
    POP <COUNTRY> : SHOWS POPULATION DATA OF COUNTRY.
    NUKES <COUNTRY> : SHOWS PAYLOAD DELIVERY DATA OF COUNTRY.
    VIEW <TARGET> : DISPLAYS STATISTICS OF TARGET.
    INFO <VEHICLE> : DISPLAYS STATISTICS OF DELIVERY VEHICLE.

`

let basicBadInputText =
`COMMAND NOT RECOGNIZED.
PLEASE TRY AGAIN OR USE 'HELP'.\n`

let helpGamesText =
`'GAMES' REFERS TO MODELS, SIMULATIONS,
AND GAMES WHICH HAVE TACTICAL AND STRATEGIC APPLICATIONS.`

let basicBadTargetText = 
`THAT IS NOT A VALID TARGET. PLEASE TRY AGAIN OR USE
'LIST <COUNTRY>' TO VIEW VIABLE TARGET CITIES.`

let basicBadVehicleText = 
`THAT IS NOT A VALID VEHICLE. PLEASE TRY AGAIN OR USE
'NUKES <COUNTRY>' TO VIEW PAYLOAD DELIVERY VEHICLES.`

let selectedSelfTargetText =
`FIRING UPON TARGET UNDER YOUR OWN CONTROL IS NOT ADVISABLE.
PLEASE TRY AGAIN.`

let basicBadPayloadText = 
`THAT IS NOT A VALID PAYLOAD STRENGTH.
PLEASE TRY AGAIN OR USE 'HELP LAUNCH'.`

let alreadySelectedInitialText = 
`DUPLICATE TARGETS NOT ALLOWED FOR INITIAL STRIKE.
PLEASE TRY AGAIN.`

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
-----------------------------


`

let helpFirstStrikeText = 
`SUBMIT TWO INITIAL TARGETS SEPARATED BY LINE.

COUNTRIES CAN BE REFERRED TO BY NAME OR NUMBER.
    UNITED STATES : 1
    SOVIET UNION : 2

HOW TO WIN: ELIMINATE THE ENEMY'S CORE POPULATION
BEFORE THEY CAN DO THE SAME TO YOU. HOWEVER, IF
YOUR POPULATION IS TOO LOW WHEN YOU DO SO,
YOUR COUNTRY WILL FALL AND YOU, TOO, WILL LOSE.

NEW USERS SHOULD FAMILIARIZE THEMSELVES WITH THE
W.O.P.R. SYSTEM OPERATION MANUAL BEFORE CONTINUING.`

let helpLaunchText = 
`LAUNCH PROTOCOL WILL ASK FOR:
SOURCE : <DELIVERY VEHICLE>
DESTINATION : <TARGET>
PAYLOAD STRENGTH : <INTEGER>

DESTINATION MUST BE WITHIN SOURCE'S TARGETABLE ZONE.
PAYLOAD STRENGTH MUST BE MORE THAN ZERO
AND NO MORE THAN SOURCE'S CURRENT RESERVE.

USE 'BACK' TO EXIT LAUNCH PROTOCOL.

NOTE: LAUNCH PROTOCOL IS NOT FIRST STRIKE COMMAND.`

let launchTextMe =
`SUCCESS: OUTBOUND NUCLEAR MISSILES EN ROUTE TO`

let launchTextThem = `WARNING: INBOUND NUCLEAR MISSILE THREAT. LOCATION(S):`

let launchText1 = 
`ENTERING LAUNCH PROTOCOL
------------------------

SOURCE: `

let launchText2 = 
`\n\nDESTINATION: `

let launchText3 = 
`\n\nPAYLOAD STRENGTH: `

let missileDrawTextLeft =
`                //          
               //           
              //            
             //             
            //              
          ///\\\\`
let missileDrawTextRight =
`        \\\\                 
         \\\\                
          \\\\               
           \\\\              
            \\\\             
           //\\\\\\`


let lossWarningText =
`!!WARNING!!

POPULATION HAS DROPPED BELOW RECOVERY THRESHOLD OF 20%.
SOCIETAL COLLAPSE IMMINENT. VICTORY IS IMPOSSIBLE.`

let winWarningText = 
`!!ALERT!!

ENEMY POPULATION HAS DROPPED BELOW RECOVERY THRESHOLD OF 20%.
SOCIETAL COLLAPSE IMMINENT. VICTORY IS POSSIBLE.`

let bothLossText =
`!!WARNING!!

GLOBAL POPULATION HAS DROPPED BELOW RECOVERY THRESHOLD.
MUTUAL ANNIHILATION IMMINENT.`

let winnerTemplate = `WINNNER:`

let bothLossBig = `WINNER: NONE`

let myWinText = 
`!!CONGRATULATIONS!!

YOU HAVE SURVIVED GLOBAL THERMONUCLEAR WAR.
SIMULATION TERMINATING....`

let myLossText = 
`!!FAILURE!!

YOU HAVE BEEN UTTERLY ANNIHILIATED IN
GLOBAL THERMONUCLEAR WAR.
SIMULATION TERMINATING....`