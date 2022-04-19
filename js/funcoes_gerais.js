/*
    VARIÁVEIS
*/

var qtd_variaveis = 0,
    qtd_restricoes = 0,
    maximizar = "maximize";

var funcaoOBJ, restricao1, restricao2, restricao3;
/*
    EVENTOS
*/
$("#btn_processar").click(function () {
    //Atribuição de valor para as variáveis iniciais
    qtd_variaveis = $("#qtd_variavel").val();
    qtd_restricoes = $("#qtd_restricao").val();

    funcaoOBJ = new Array(qtd_variaveis);
    restricao1 = new Array(qtd_variaveis + 1);
    restricao2 = new Array(qtd_variaveis + 1);
    restricao3 = new Array(qtd_variaveis + 1);

    if ($("input[type='radio']:checked").val() == 1) {
        maximizar = "maximize";
    } else {
        maximizar = "minimize";
    }

    //Desabilita campos iniciais
    $("#qtd_variavel").prop("disabled", "disabled");
    $("#qtd_restricao").prop("disabled", "disabled");
    $("#radio_max").prop("disabled", "disabled");
    $("#radio_min").prop("disabled", "disabled");
    $("#btn_processar").prop("disabled", "disabled");

    //Exibe cards escondidos
    $("#form").show();
    $("#botoes").show();

    for (let i = 0; i < qtd_variaveis - 1; i++) {
        $("#funcao").append(`<input id="funcao_x`+(i + 1) + `" type="number" class="form-control mb-2 me-sm-2">X`+(i + 1)+` + `);
    }
    $("#funcao").append(`<input id="funcao_x` +qtd_variaveis+`" type="number" class="form-control mb-2 me-sm-2">X`+qtd_variaveis+``);

    for (let p = 0; p < qtd_restricoes; p++) {
        $("#restricao").append(`<div id="r_` + (p + 1) + `" class="form-inline">`);
        for (let i = 0; i < qtd_variaveis - 1; i++) {
            $("#r_" + (p + 1)).append(`<input id="restricao_` +(p + 1) +`_X` +(i + 1) +`" type="number" class="form-control mb-2 me-sm-2">X` +(i + 1) +` + `);
        }
        $("#r_" + (p + 1)).append(`<input id="restricao_` +(p + 1) +`_X` +qtd_variaveis +`" type="number" class="form-control mb-2 me-sm-2">X` +qtd_variaveis +``);
        $("#r_" + (p + 1)).append(`<select id="restricao_` +(p + 1) +`_sinal" class="form-control mb-2 me-sm-2">`);
        $("#restricao_" + (p + 1) + "_sinal").append(`<option value="<=">&le;</option>`);
        $("#restricao_" + (p + 1) + "_sinal").append(`<option value=">=">&ge;</option>`);
        //$("#restricao_" + (p + 1) + "_sinal").append(`<option value=">">&gt;</option>`);
        //$("#restricao_" + (p + 1) + "_sinal").append(`<option value="<">&lt;</option>`);
        $("#restricao_" + (p + 1) + "_sinal").append(`<option value="igual">=</option>`);
        $("#restricao_" + (p + 1) + "_sinal").append(`</select>`);
        $("#r_" + (p + 1)).append(`<input id="restricao_` +(p + 1) +`_igual" type="number" class="form-control mb-2 me-sm-2">`);
        $("#restricao").append(`</div>`);
    }
});

$("#btn_recomecar").click(function () {
    location.reload();
});

$("#btn_limpar").click(function () {
    for (let i = 0; i < qtd_variaveis; i++) {
        $("#funcao_x" + (i + 1)).val("");
    }

    for (let p = 0; p < qtd_restricoes; p++) {
        for (let i = 0; i < qtd_variaveis; i++) {
            $("#restricao_" + (p + 1) + "_X" + (i + 1)).val("");
        }
        $("#restricao_" + (p + 1) + "_igual").val("");
    }
});

/*
    ALGORITMO
*/
$("#btn_calcular").click(function () {
    for (let i = 0; i < qtd_variaveis; i++) {
        funcaoOBJ[i] = $("#funcao_x" + (i + 1)).val();
    }

    for (let i = 0; i < qtd_variaveis; i++) {
        restricao1[i] = $("#restricao_1_X" + (i + 1)).val();
        restricao2[i] = $("#restricao_2_X" + (i + 1)).val();
        restricao3[i] = $("#restricao_3_X" + (i + 1)).val();
    }
    restricao1[qtd_variaveis] = $("#restricao_1_igual").val();
    restricao2[qtd_variaveis] = $("#restricao_2_igual").val();
    restricao3[qtd_variaveis] = $("#restricao_3_igual").val();

    var sinal_restricao1 = $('#restricao_1_sinal').val();
    var sinal_restricao2 = $('#restricao_2_sinal').val();
    var sinal_restricao3 = $('#restricao_3_sinal').val();

    var input = {};

    if(qtd_restricoes == 3){
        input = {
            type: maximizar,
            objective : funcaoOBJ[0]+"x1 + "+ funcaoOBJ[1]+"x2",
            constraints : [
                restricao1[0]+"x1 + "+restricao1[1]+"x2 "+sinal_restricao1+" "+restricao1[qtd_variaveis],
                restricao2[0]+"x1 + "+restricao2[1]+"x2 "+sinal_restricao2+" "+restricao2[qtd_variaveis],
                restricao3[0]+"x1 + "+restricao3[1]+"x2 "+sinal_restricao3+" "+restricao3[qtd_variaveis]
            ]
        };
    }else if(qtd_restricoes == 2){
        input = {
            type: maximizar,
            objective : funcaoOBJ[0]+"x1 + "+ funcaoOBJ[1]+"x2",
            constraints : [
                restricao1[0]+"x1 + "+restricao1[1]+"x2 "+sinal_restricao1+" "+restricao1[qtd_variaveis],
                restricao2[0]+"x1 + "+restricao2[1]+"x2 "+sinal_restricao2+" "+restricao2[qtd_variaveis]
            ]
        };
    }else{
        input = {
            type: maximizar,
            objective : funcaoOBJ[0]+"x1 + "+ funcaoOBJ[1]+"x2",
            constraints : [
                restricao1[0]+"x1 + "+restricao1[1]+"x2 "+sinal_restricao1+" "+restricao1[qtd_variaveis]
            ]
        };
    }

    $.ajax({
        type: "POST",
        url: "http://localhost:1706/calcular",
        data: input,
        mode: 'cors',
        success: function(data){
            var output = JSON.parse(JSON.stringify(data));
            console.log(output.result);
            console.log(output.result["x1"]);
            const resultado = document.getElementById("resultado");
            resultado.innerHTML=
        '<table>'+
        '<thead>'+
            '<tr>'+
                '<th colspan="2">RESULTADO</th>'+
            '</tr>'+
        '</thead>'+
        '<tbody>'+
        '    <tr></tr>'+
        '    <tr>'+
        '        <td> X1: '+output.result["x1"]+'</td>'+
        '    </tr>'+
        '    <tr>'+
        '        <td> X2: '+output.result["x2"]+'</td>'+
        '    </tr>'+
        '    <tr>'+
        '        <td> Z: '+output.result["z"]+'</td>'+
        '    </tr>'+
        '    <tr>'+
        '</tbody>'+
    '</table>';
        },
        error: function() {
            alert("ERRO");
        }
    });
});
