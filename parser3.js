var cont_id = 1;//conar os ids para relacionar os blocos de comando
//----------------

document.getElementById('file').addEventListener('change', handleFileSelect, false);

function parseContent(blob){
      reader = new FileReader();
      reader.readAsText(blob);
      reader.addEventListener('loadend',
        function f(e){
         text = e.srcElement.result;
         scratch_code = text;
         console.log(text);
         challengeCode = getJSON(scratch_code);
         document.getElementById("pcode").value = challengeCode;
        }
      );
};

function openFile(event){
        var file = document.getElementById('file').files[0];
        var input = event.target;
        var reader = new FileReader();
        var blob = file.slice(0, file.size);
        var pLoader  = new ProjectLoader();
        reader.readAsBinaryString(blob);
        pLoader.unzipBlob(blob, parseContent);
        console.log("unzip concluido");
};

function getJSON(conteudo){
   var obj = JSON.parse(conteudo);
   var interpreter = new StartExpression(cont_id, "token");  
   var format_code = "";
   for(var c = 0; c < obj.targets.length; c++)
       format_code += interpreter.parseLineStart(obj.targets[c].blocks, 1);
   return format_code;
}