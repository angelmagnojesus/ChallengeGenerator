/*
 * TO DO:
 * ADD .NEXT in each instruction  "TERMINAL" EX. WAIT 
 * 
 */
//RELATION VAR
const RELATION_BELOW = "below";
const RELATION_INSIDE = "inside";
const RELATION_INSIDE_IF = "inside_if"; //only on "if esle" cases
const RELATION_INSIDE_ELSE = "inside_else";
const RELATION_CONDITION = "condition";
const RELATION_OPERAND = "operand";
const RELATION_NONE = "x";

const SEPARATOR = ";";
const NONE = "x";

var challenge = new Challenge();

//-------------------------------------------------
var AbstractExpression = function(id_related, token) {  
    if (this.constructor === AbstractExpression) {  
        throw new Error("Can't instantiate abstract class!");  
    }
    this.id_related = id_related; 
    this.token = token;
};  

AbstractExpression.prototype.TOKENS_START = ["event_whenflagclicked", "event_whenkeypressed",
                                             "event_whenbroadcastreceived","event_whenthisspriteclicked",
                                             "control_start_as_clone"];
AbstractExpression.prototype.TOKENS_TERMINAL = ["motion_movesteps","motion_goto",
                                                "looks_say", "looks_sayforsecs",
                                                "looks_nextcostume", "looks_hide",
                                                "sound_play","motion_goto",
                                                "sensing_touchingcolor", "sensing_mousedown",
                                                "sensing_touchingobject", "sensing_keypressed",
                                                "control_create_clone_of", "control_delete_this_clone",
                                                "sensing_mousex", "sensing_mousey"];
AbstractExpression.prototype.TOKENS_SINGLE_CONDITIONAL = ["control_if","control_wait_until"];
AbstractExpression.prototype.TOKENS_IF_ELSE = "control_if_else";
AbstractExpression.prototype.TOKEN_REPEAT = "control_repeat";
AbstractExpression.prototype.TOKEN_REPEATFOREVER = "control_forever";
AbstractExpression.prototype.TOKEN_WAIT = "control_wait";
AbstractExpression.prototype.TOKENS_SET_VARIABLE = ["data_setvariableto","data_changevariableby",
                                                    "motion_sety", "motion_changeyby",
                                                    "motion_setx", "motion_changexby"];
AbstractExpression.prototype.TOKENS_OPERATIONS_2_NUM = ["operator_add","operator_subtract",
                                                  "operator_multiply", "operator_divide",
                                                  "operator_mod"];
AbstractExpression.prototype.TOKEN_MOTION_GOTO_XY = "motion_gotoxy";
AbstractExpression.prototype.TOKEN_RANDOM = "operator_random";
AbstractExpression.prototype.TOKEN_VARIABLE = "variable";
//AbstractExpression.prototype.TOKENS_SENSING = ["sensing_touchingcolor", "sensing_touchingobject"];

AbstractExpression.prototype.interprete = function(code_vector, key, relation){  
    throw new Error("Abstract method!");  
}

AbstractExpression.prototype.parseLineStart = 
        function(code_vector, id_related) 
{
    var properties = Object.getOwnPropertyNames(code_vector);
    for(var i = 0; i < properties.length; i++){
        for(var j = 0; j < this.TOKENS_START.length; j++){
            if(this.TOKENS_START[j] === code_vector[properties[i]].opcode){
                var startExpression = new StartExpression(id_related, this.TOKENS_START[j]);  
                startExpression.interprete(code_vector, properties[i], RELATION_NONE);
                break;
            }
        }
    }
    return challenge.getLastAlg().format_code;
}

AbstractExpression.prototype.parseLine = 
        function(code_vector, key,relation, id_related) 
{
        for(var i = 0; i < this.TOKENS_TERMINAL.length; i++){
            if(this.TOKENS_TERMINAL[i] === code_vector[key].opcode){
               var terminalExpression = new TerminalExpression(id_related, this.TOKENS_TERMINAL[i]);  
               terminalExpression.interprete(code_vector, key, relation);
               break;
            }
        }
        for(var i = 0; i < this.TOKENS_SINGLE_CONDITIONAL.length; i++){
            if(this.TOKENS_SINGLE_CONDITIONAL[i] === code_vector[key].opcode){
               var singleConditionalExpression = new SingleConditionalExpression(id_related, this.TOKENS_SINGLE_CONDITIONAL[i]);  
               singleConditionalExpression.interprete(code_vector, key, relation);
               break;
            }
        }
        if(this.TOKENS_IF_ELSE === code_vector[key].opcode){
            var ifElseConditionalExpression = new IfElseConditionalExpression(id_related, this.TOKENS_IF_ELSE);  
            ifElseConditionalExpression.interprete(code_vector, key, relation);
            return;
        }
        if(this.TOKEN_REPEAT === code_vector[key].opcode){
            var repeatExpression = new RepeatExpression(id_related, this.TOKEN_REPEAT);  
            repeatExpression.interprete(code_vector, key, relation);
            return;
        }
        if(this.TOKEN_REPEATFOREVER === code_vector[key].opcode){
            var repeatForeverExpression = new RepeatForeverExpression(id_related, this.TOKEN_REPEATFOREVER);  
            repeatForeverExpression.interprete(code_vector, key, relation);
            return;
        }
        if(this.TOKEN_WAIT === code_vector[key].opcode){
            var waitExpression = new WaitExpression(id_related, this.TOKEN_WAIT);  
            waitExpression.interprete(code_vector, key, relation);
            return;
        }
        if(this.TOKEN_MOTION_GOTO_XY === code_vector[key].opcode){
            var goToXYExpression = new GoToXYExpression(id_related, this.TOKEN_MOTION_GOTO_XY);  
            goToXYExpression.interprete(code_vector, key, relation);
            return;
        }
        if(this.TOKEN_RANDOM === code_vector[key].opcode){
            var randomExpression = new RandomExpression(id_related, this.TOKEN_RANDOM);  
            randomExpression.interprete(code_vector, key, relation);
            return;
        }
        for(var i = 0; i < this.TOKENS_SET_VARIABLE.length; i++){
            if(this.TOKENS_SET_VARIABLE[i] === code_vector[key].opcode){
               var setVariableExpression = new SetVariableExpression(id_related, this.TOKENS_SET_VARIABLE[i]);  
               setVariableExpression.interprete(code_vector, key, relation);
               break;
            }
        }
        for(var i = 0; i < this.TOKENS_OPERATIONS_2_NUM.length; i++){
            if(this.TOKENS_OPERATIONS_2_NUM[i] === code_vector[key].opcode){
               var opeartion2NumExpression = new Opeartion2NumExpression(id_related, this.TOKENS_OPERATIONS_2_NUM[i]);  
               opeartion2NumExpression.interprete(code_vector, key, relation);
               break;
            }
        }
        /*for(var i = 0; i < this.TOKENS_SENSING.length; i++){
            if(this.TOKENS_SENSING[i] === code_vector[key].opcode){
               var sensingExpression = new SensingExpression(id_related, this.TOKENS_SINGLE_CONDITIONAL[i]);  
               sensingExpression.interprete(null, null, relation);
               break;
            }
        }*/
}
//------------------------------------------------------------------------------
function isNum(operand){
    return /[0-9]/.test(operand);// /[^a-zA-Z0-9]/.test(operand);  
 }
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var StartExpression = function(id_related, token) {  
    AbstractExpression.apply(this, [id_related, token]);  
};

StartExpression.prototype = Object.create(AbstractExpression.prototype);  
StartExpression.prototype.constructor = StartExpression;  
StartExpression.prototype.interprete = function(code_vector, key, relation){ 
    var current_id = challenge.getLastAlg().cont_id;
    challenge.getLastAlg().cont_id++;
    challenge.getLastAlg().format_code += current_id + SEPARATOR + this.token + 
                        SEPARATOR + relation + SEPARATOR + relation + SEPARATOR;//";x;x;";//X e X pois geralmente não vem precedido de nada
    var nextkey = code_vector[key].next;
    var code_vector2 = code_vector[nextkey];
    while(code_vector2 !== undefined){
        this.parseLine(code_vector, nextkey, RELATION_BELOW, current_id);
        nextkey = code_vector2.next;
        code_vector2 = code_vector[nextkey];
    }
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var TerminalExpression = function(id_related, token) {  
    AbstractExpression.apply(this, [id_related, token]);  
};

TerminalExpression.prototype = Object.create(AbstractExpression.prototype);  
TerminalExpression.prototype.constructor = TerminalExpression;  
TerminalExpression.prototype.interprete = function(code_vector, key, relation){  
    //formato: ["forward:", 10]
    var current_id = challenge.getLastAlg().cont_id;
    challenge.getLastAlg().cont_id++;
    challenge.getLastAlg().format_code += current_id + SEPARATOR + this.token + SEPARATOR + relation + SEPARATOR + this.id_related + SEPARATOR;
    var nk = code_vector[key].next;
    if(nk !== null)
        this.parseLine(code_vector, nk, relation, this.id_related);
    
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var SensingExpression = function(id_related, token) {  
    AbstractExpression.apply(this, [id_related, token]);  
};

SensingExpression.prototype = Object.create(AbstractExpression.prototype);  
SensingExpression.prototype.constructor = SensingExpression;  
SensingExpression.prototype.interprete = function(code_vector, key, relation){  
    var current_id = challenge.getLastAlg().cont_id;
    challenge.getLastAlg().cont_id++;
    challenge.getLastAlg().format_code += current_id + SEPARATOR + this.token + SEPARATOR + relation + SEPARATOR + this.id_related + SEPARATOR;
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var SingleConditionalExpression = function() {  
    AbstractExpression.apply(this, arguments);  
};

SingleConditionalExpression.prototype = Object.create(AbstractExpression.prototype);  
SingleConditionalExpression.prototype.constructor = SingleConditionalExpression;  
SingleConditionalExpression.prototype.interprete = function(code_vector, key, relation){  
    //formato: ["doIf", ["touching:", "_mouse_"], [["forward:", 10]]]
    var current_id = challenge.getLastAlg().cont_id;
    challenge.getLastAlg().cont_id++;
    challenge.getLastAlg().format_code += current_id + SEPARATOR + this.token + SEPARATOR + relation + SEPARATOR + this.id_related + SEPARATOR;
    
    var condition = code_vector[key].inputs.CONDITION;
    var ck = condition[1];
    this.parseLine(code_vector, ck, RELATION_CONDITION, current_id);
    
    var substack = code_vector[key].inputs.SUBSTACK;
    var sk = substack[1];
    this.parseLine(code_vector, sk, RELATION_INSIDE, current_id);
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var IfElseConditionalExpression = function() {  
    AbstractExpression.apply(this, arguments);  
};

IfElseConditionalExpression.prototype = Object.create(AbstractExpression.prototype);  
IfElseConditionalExpression.prototype.constructor = IfElseConditionalExpression;  
IfElseConditionalExpression.prototype.interprete = function(code_vector, key, relation){  
    var current_id = challenge.getLastAlg().cont_id;
    challenge.getLastAlg().cont_id++;
    challenge.getLastAlg().format_code += current_id + SEPARATOR + this.token + SEPARATOR + relation + SEPARATOR + this.id_related + SEPARATOR;
    
    var condition = code_vector[key].inputs.CONDITION;
    var ck = condition[1];
    this.parseLine(code_vector, ck, RELATION_CONDITION, current_id);
    
    var substack = code_vector[key].inputs.SUBSTACK;
    var sk = substack[1];
    this.parseLine(code_vector, sk, RELATION_INSIDE_IF, current_id);
    
    var substack2 = code_vector[key].inputs.SUBSTACK2;
    var sk2 = substack2[1];
    this.parseLine(code_vector, sk2, RELATION_INSIDE_ELSE, current_id);
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var RepeatExpression = function() {  
    AbstractExpression.apply(this, arguments);  
};

RepeatExpression.prototype = Object.create(AbstractExpression.prototype);  
RepeatExpression.prototype.constructor = RepeatExpression;  
RepeatExpression.prototype.interprete = function(code_vector, key, relation){  
    
    var current_id = challenge.getLastAlg().cont_id;
    challenge.getLastAlg().cont_id++;
    challenge.getLastAlg().format_code += current_id + SEPARATOR + this.token + SEPARATOR + relation + SEPARATOR + this.id_related + SEPARATOR;
   
    var times = code_vector[key].inputs.TIMES;
    var timesVal = times[1][1];
    
    if(!isNum(timesVal)){
        var terminalExpression = new TerminalExpression(current_id, this.TOKEN_VARIABLE);  
        terminalExpression.interprete(null, null, RELATION_OPERAND);
    }

    var substack = code_vector[key].inputs.SUBSTACK;
    var sk = substack[1];
    this.parseLine(code_vector, sk, RELATION_INSIDE, current_id);
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var RepeatForeverExpression = function() {  
    AbstractExpression.apply(this, arguments);  
};

RepeatForeverExpression.prototype = Object.create(AbstractExpression.prototype);  
RepeatForeverExpression.prototype.constructor = RepeatForeverExpression;  
RepeatForeverExpression.prototype.interprete = function(code_vector, key, relation){  
    
    var current_id = challenge.getLastAlg().cont_id;
    challenge.getLastAlg().cont_id++;
    challenge.getLastAlg().format_code += current_id + SEPARATOR + this.token + SEPARATOR + relation + SEPARATOR + this.id_related + SEPARATOR;
   
    var substack = code_vector[key].inputs.SUBSTACK;
    var sk = substack[1];
    this.parseLine(code_vector, sk, RELATION_INSIDE, current_id);
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var WaitExpression = function() {  
    AbstractExpression.apply(this, arguments);  
};

WaitExpression.prototype = Object.create(AbstractExpression.prototype);  
WaitExpression.prototype.constructor = WaitExpression;  
WaitExpression.prototype.interprete = function(code_vector, key, relation){  
    var current_id = challenge.getLastAlg().cont_id;
    challenge.getLastAlg().cont_id++;
    challenge.getLastAlg().format_code += current_id + SEPARATOR + this.token + SEPARATOR + relation + SEPARATOR + this.id_related + SEPARATOR;
    var times = code_vector[key].inputs.DURATION;
    var timesVal = times[1][1];
    if(!isNum(timesVal)){
        var terminalExpression = new TerminalExpression(current_id, this.TOKEN_VARIABLE);  
        terminalExpression.interprete(null, null, RELATION_OPERAND);
    }
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var SetVariableExpression = function() {  
    AbstractExpression.apply(this, arguments);  
};

SetVariableExpression.prototype = Object.create(AbstractExpression.prototype);  
SetVariableExpression.prototype.constructor = SetVariableExpression;  
SetVariableExpression.prototype.interprete = function(code_vector, key, relation){  
    
    var current_id = challenge.getLastAlg().cont_id;
    challenge.getLastAlg().cont_id++;
    challenge.getLastAlg().format_code += current_id + SEPARATOR + this.token + SEPARATOR + relation + SEPARATOR + this.id_related + SEPARATOR;
    var value = code_vector[key].inputs.VALUE;
    if(value === undefined)
        value = code_vector[key].inputs.DY;
    if(code_vector[value[1]] !== undefined){
        this.parseLine(code_vector, value[1], RELATION_OPERAND, current_id);
    }else if(!isNum(value[1][1])){
        var terminalExpression = new TerminalExpression(current_id, this.TOKEN_VARIABLE);  
        terminalExpression.interprete(null, null, RELATION_OPERAND);
    }// else is a number nothing to do
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var Opeartion2NumExpression = function() {  
    AbstractExpression.apply(this, arguments);  
};

Opeartion2NumExpression.prototype = Object.create(AbstractExpression.prototype);  
Opeartion2NumExpression.prototype.constructor = Opeartion2NumExpression;  
Opeartion2NumExpression.prototype.interprete = function(code_vector, key, relation){  
    
    var current_id = challenge.getLastAlg().cont_id;
    challenge.getLastAlg().cont_id++;
    challenge.getLastAlg().format_code += current_id + SEPARATOR + this.token + SEPARATOR + relation + SEPARATOR + this.id_related + SEPARATOR;
   
    var num1 = code_vector[key].inputs.NUM1;
    var num2 = code_vector[key].inputs.NUM2;
    
    if(code_vector[num1[1]] !== undefined){ //operand is another operation
        this.parseLine(code_vector, num1[1], RELATION_OPERAND, current_id);
    }else if(!isNum(num1[1][1])){ //operand is a variable
        var terminalExpression = new TerminalExpression(current_id, this.TOKEN_VARIABLE);  
        terminalExpression.interprete(null, null, RELATION_OPERAND);
    }
    
    if(code_vector[num2[1]] !== undefined){
        this.parseLine(code_vector, num2[1], RELATION_OPERAND, current_id);
    }else if(!isNum(num2[1][1])){ //operand is a variable
        var terminalExpression = new TerminalExpression(current_id, this.TOKEN_VARIABLE);  
        terminalExpression.interprete(null, null, RELATION_OPERAND);
    }
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var GoToXYExpression = function() {  
    AbstractExpression.apply(this, arguments);  
};

GoToXYExpression.prototype = Object.create(AbstractExpression.prototype);  
GoToXYExpression.prototype.constructor = GoToXYExpression;  
GoToXYExpression.prototype.interprete = function(code_vector, key, relation){  
    
    var current_id = challenge.getLastAlg().cont_id;
    challenge.getLastAlg().cont_id++;
    challenge.getLastAlg().format_code += current_id + SEPARATOR + this.token + SEPARATOR + relation + SEPARATOR + this.id_related + SEPARATOR;
   
    var num1 = code_vector[key].inputs.X;
    var num2 = code_vector[key].inputs.Y;
    
    if(code_vector[num1[1]] !== undefined){ //operand is another operation
        this.parseLine(code_vector, num1[1], RELATION_OPERAND, current_id);
    }else if(!isNum(num1[1][1])){ //operand is a variable
        var terminalExpression = new TerminalExpression(current_id, this.TOKEN_VARIABLE);  
        terminalExpression.interprete(null, null, RELATION_OPERAND);
    }
    
    if(code_vector[num2[1]] !== undefined){
        this.parseLine(code_vector, num2[1], RELATION_OPERAND, current_id);
    }else if(!isNum(num2[1][1])){ //operand is a variable
        var terminalExpression = new TerminalExpression(current_id, this.TOKEN_VARIABLE);  
        terminalExpression.interprete(null, null, RELATION_OPERAND);
    }
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var RandomExpression = function() {  
    AbstractExpression.apply(this, arguments);  
};

RandomExpression.prototype = Object.create(AbstractExpression.prototype);  
RandomExpression.prototype.constructor = RandomExpression;  
RandomExpression.prototype.interprete = function(code_vector, key, relation){  
    
    var current_id = challenge.getLastAlg().cont_id;
    challenge.getLastAlg().cont_id++;
    challenge.getLastAlg().format_code += current_id + SEPARATOR + this.token + SEPARATOR + relation + SEPARATOR + this.id_related + SEPARATOR;
   
    var num1 = code_vector[key].inputs.FROM;
    var num2 = code_vector[key].inputs.TO;
    
    if(code_vector[num1[1]] !== undefined){ //operand is another operation
        this.parseLine(code_vector, num1[1], RELATION_OPERAND, current_id);
    }else if(!isNum(num1[1][1])){ //operand is a variable
        var terminalExpression = new TerminalExpression(current_id, this.TOKEN_VARIABLE);  
        terminalExpression.interprete(null, null, RELATION_OPERAND);
    }
    
    if(code_vector[num2[1]] !== undefined){
        this.parseLine(code_vector, num2[1], RELATION_OPERAND, current_id);
    }else if(!isNum(num2[1][1])){ //operand is a variable
        var terminalExpression = new TerminalExpression(current_id, this.TOKEN_VARIABLE);  
        terminalExpression.interprete(null, null, RELATION_OPERAND);
    }
}
//------------------------------------------------------------------------------