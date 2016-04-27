$(document).ready(function() {

$("#btnSaveComp").click(function()
    {
        $("#company").submit(function(e)
        {
            var postData = $(this).serializeArray();
            var formURL = $(this).attr("action");
            alert(formURL);
            $.ajax(
            {
                url : formURL,
                type: "POST",
                data : postData,
                success:function(data, textStatus, jqXHR) 
                {
                   $("#divCompany").html(data);
                   if( typeof document.getElementById("compName").value != 'undefined')
                   {
                        $("#cN").html("<span>"+ document.getElementById("compName").value +"</span>");
                   }else
                   {
                        $("#cN").html("<span>"+ document.getElementById("compName").innerHTML +"</span>");
                   }
                   RegClkPC();
                },
                error: function(jqXHR, textStatus, errorThrown) 
                {
                    //$("#simple-msg").html('<pre><code class="prettyprint">AJAX Request Failed<br/> textStatus='+textStatus+', errorThrown='+errorThrown+'</code></pre>');
                    alert(errorThrown +"    "+ textStatus);
                }
            });
            e.preventDefault(); //STOP default action
            e.unbind();
        });
            
        $("#company").submit(); //SUBMIT FORM
    });


$("#btnSaveBranch").click(function()
  {
    if((document.getElementById("company").action).indexOf("id:") >= 0)
    {
        var fcid="";
        if((document.getElementById("company").action).indexOf("id:") >= 0)
        {
            fcid =(document.getElementById("company").action).split("id:")[1];
        }
        $("#branch").submit(function(e)
          {
              var postData = $(this).serializeArray();
                postData.push({"name":"cid","value":fcid});
                postData.push({"name":"bcid","value":bcid});
                //alert(JSON.stringify(postData));
              var formURL = $(this).attr("action");
              var formMethod = $(this).attr("method");
              $.ajax(
              {
                  url : formURL,
                  type: "POST",
                  data : postData,
                  dataType: "json",
                  success:function(data, textStatus, jqXHR) 
                  {
                      if(bcid.length > 0)
                        {
                            $(document.getElementsByName(bcid)[0].parentNode.parentNode).replaceWith("<tr><td>"+data.branchName+"</td><td>"+ data.branchUrl+"</td><td>"+ data.addressline1+"</td><td>"+ data.addressline2+"</td><td>"+ data.city+"</td><td>"+ data.state+"</td><td>"+ data.country+"</td><td>"+ data.zipcode+"</td><td>"+ data.pagetitle+"</td><td>"+ data.metatitle+"</td><td>"+ data.metadescription+"</td><td>"+ data.metakeywords+"</td><td>"+ '<input name='+data._id+' type="button" value="X" onclick="removeRow(this)">' +"</td><td>"+ '<input name=e'+data._id+' type="button" value="Edit" onclick="editRow(this)">' +"</td></tr>");
                          }
                      else{
                          $("#branches").append("<tr><td>"+data.branchName+"</td><td>"+ data.branchUrl+"</td><td>"+ data.addressline1+"</td><td>"+ data.addressline2+"</td><td>"+ data.city+"</td><td>"+ data.state+"</td><td>"+ data.country+"</td><td>"+ data.zipcode+"</td><td>"+ data.pagetitle+"</td><td>"+ data.metatitle+"</td><td>"+ data.metadescription+"</td><td>"+ data.metakeywords+"</td><td>"+ '<input name='+data._id+' type="button" value="X" onclick="removeRow(this)">' +"</td><td>"+ '<input name=e'+data._id+' type="button" value="Edit" onclick="editRow(this)">' +"</td></tr>");
                        }
                      $("#btnSaveBranch").val("Save");
                      //bcid = 
                      //$("#branches").html(document.getElementById("branches").innerHTML + "<li id='"+data._id+"'>" +data._id + "   "+data.branchName + "   "+data.city+ "   "+data.addressline1+ "   "+data.addressline2 + '<input name='+data._id+' type="button" value="-" onclick="removeRow(this)">'+ '<input name=e'+data._id+' type="button" value="-" onclick="editRow(this)">'+ "</li>");
                       document.getElementById("branch").reset();
                      $("#phones").html("");
                      $("#emails").html("");
                      $("#olhelps").html("");
                      $("#chats").html("");
                  },
                  error: function(jqXHR, textStatus, errorThrown) 
                  {
                      //$("#simple-msg").html('<pre><code class="prettyprint">AJAX Request Failed<br/> textStatus='+textStatus+', errorThrown='+errorThrown+'</code></pre>');
                      alert(errorThrown + "   td = " + textStatus);
                  }
              });
              e.preventDefault(); //STOP default action
              e.unbind();
          });
          $("#branch").submit(); //SUBMIT FORM
        
      }else{
        alert("Oops! You forgot to add the company. Please add a company first.");
      }
    });

$("#btnSavePhone").click(function()
  {
    if((document.getElementById("company").action).indexOf("id:") >= 0)
    {
      if($("#branches").length >0)
      {
          var fcid="";
          var fbcid="";
              fcid =(document.getElementById("company").action).split("id:")[1];
              fbcid = document.getElementsByName("branches")[0].rows[document.getElementsByName("branches")[0].rows.length-1].cells[12].firstChild.name;
              //($("#branches").find("li")[($("#branches").find("li").length-1)]).id;

          $("#phone").submit(function(e)
            {
                var postData = $(this).serializeArray();
                  postData.push({"name":"cid","value":fcid});
                  postData.push({"name":"bcid","value":fbcid});
                  postData.push({"name":"phid","value":phid});
                var formURL = $(this).attr("action");
                var formMethod = $(this).attr("method");
                $.ajax(
                {
                    url : formURL,
                    type: "POST",
                    data : postData,
                    dataType: "json",
                    success:function(data, textStatus, jqXHR) 
                    {
                        if(phid.length > 0)
                          {
                            $(document.getElementsByName(phid)[0].parentNode.parentNode).replaceWith("<tr><td>"+data.compPhoneTitle +"</td><td>"+ data.compPhoneNumber +"</td><td>"+ data.compPhoneDes +"</td><td>"+ data.callingInstructions +"</td><td>"+ data.ckMon +"</td><td>"+ data.fromMon +"</td><td>"+ data.toMon +"</td><td>"+ data.ckTue +"</td><td>"+ data.fromTue +"</td><td>"+ data.toTue +"</td><td>"+ data.ckWed +"</td><td>"+ data.fromWed +"</td><td>"+ data.toWed +"</td><td>"+ data.ckThu +"</td><td>"+ data.fromThu +"</td><td>"+ data.toThu +"</td><td>"+ data.ckFri +"</td><td>"+ data.fromFri +"</td><td>"+ data.toFri +"</td><td>"+ data.ckSat +"</td><td>"+ data.fromSat +"</td><td>"+ data.toSat +"</td><td>"+ data.ckSun +"</td><td>"+ data.fromSun +"</td><td>"+ data.toSun +"</td><td>"+ data.percentResolved +"</td><td>"+ data.avgWaitTime +"</td><td>"+ '<input name='+data._id+' type="button" value="X" onclick="removeRow(this)">' +"</td><td>"+ '<input name=e'+data._id+' type="button" value="Edit" onclick="editRow(this)">' +"</td></tr>");
                          }
                          else
                          {
                            $("#phones").append("<tr><td>"+data.compPhoneTitle +"</td><td>"+ data.compPhoneNumber +"</td><td>"+ data.compPhoneDes +"</td><td>"+ data.callingInstructions +"</td><td>"+ data.ckMon +"</td><td>"+ data.fromMon +"</td><td>"+ data.toMon +"</td><td>"+ data.ckTue +"</td><td>"+ data.fromTue +"</td><td>"+ data.toTue +"</td><td>"+ data.ckWed +"</td><td>"+ data.fromWed +"</td><td>"+ data.toWed +"</td><td>"+ data.ckThu +"</td><td>"+ data.fromThu +"</td><td>"+ data.toThu +"</td><td>"+ data.ckFri +"</td><td>"+ data.fromFri +"</td><td>"+ data.toFri +"</td><td>"+ data.ckSat +"</td><td>"+ data.fromSat +"</td><td>"+ data.toSat +"</td><td>"+ data.ckSun +"</td><td>"+ data.fromSun +"</td><td>"+ data.toSun +"</td><td>"+ data.percentResolved +"</td><td>"+ data.avgWaitTime +"</td><td>"+ '<input name='+data._id+' type="button" value="X" onclick="removeRow(this)">' +"</td><td>"+ '<input name=e'+data._id+' type="button" value="Edit" onclick="editRow(this)">' +"</td></tr>");
                          }

                       // $("#phones").html(document.getElementById("phones").innerHTML + "<li>" +data._id + "   "+data.compPhoneTitle + "   "+data.compPhoneNumber+ "   "+data.compPhoneDes+  '<input name='+data._id+' type="button" value="-" onclick="removeRow(this)">'+ '<input name=e'+data._id+' type="button" value="-" onclick="editRow(this)">'+ "</li>");
                         document.getElementById("phone").reset();
                         $("#btnSaveLC").val("Save");
                         phid="";

                    },
                    error: function(jqXHR, textStatus, errorThrown) 
                    {
                        //$("#simple-msg").html('<pre><code class="prettyprint">AJAX Request Failed<br/> textStatus='+textStatus+', errorThrown='+errorThrown+'</code></pre>');
                        alert(errorThrown + "   td = " + textStatus);
                    }
                });
                e.preventDefault(); //STOP default action
                e.unbind();
            });
            $("#phone").submit(); //SUBMIT FORM

          }else{
                    alert("There is no branch for this company. Please add a branch to proceed.");
                  }
        }else{
                  alert("Oops! You forgot to add the company. Please add a company first.");
                }
    });


$("#btnSaveEmail").click(function()
  {
    if((document.getElementById("company").action).indexOf("id:") >= 0)
    {
      if($("#branches").length >0)
      {
          var fcid="";
          var fbcid="";
              fcid =(document.getElementById("company").action).split("id:")[1];
              fbcid = document.getElementsByName("branches")[0].rows[document.getElementsByName("branches")[0].rows.length-1].cells[12].firstChild.name;
              //($("#branches").find("li")[($("#branches").find("li").length-1)]).id;

          $("#email").submit(function(e)
            {
                var postData = $(this).serializeArray();
                  postData.push({"name":"cid","value":fcid});
                  postData.push({"name":"bcid","value":fbcid});
                  postData.push({"name":"eid","value":eid});
                var formURL = $(this).attr("action");
                var formMethod = $(this).attr("method");
                $.ajax(
                {
                    url : formURL,
                    type: "POST",
                    data : postData,
                    dataType: "json",
                    success:function(data, textStatus, jqXHR) 
                    {
                        if(eid.length > 0)
                          {
                            $(document.getElementsByName(eid)[0].parentNode.parentNode).replaceWith("<tr><td>"+data.compEmailTitle +"</td><td>"+ data.compEmailname +"</td><td>"+ data.compEmailDes +"</td><td>"+ data.percentResolvedMail +"</td><td>"+ data.avgWaitTimeMail +"</td><td>"+ '<input name='+data._id+' type="button" value="X" onclick="removeRow(this)">' +"</td><td>"+ '<input name=e'+data._id+' type="button" value="Edit" onclick="editRow(this)">' +"</td></tr>");
                          }
                          else
                          {
                            $("#emails").append("<tr><td>"+data.compEmailTitle +"</td><td>"+ data.compEmailname +"</td><td>"+ data.compEmailDes +"</td><td>"+ data.percentResolvedMail +"</td><td>"+ data.avgWaitTimeMail +"</td><td>"+ '<input name='+data._id+' type="button" value="X" onclick="removeRow(this)">' +"</td><td>"+ '<input name=e'+data._id+' type="button" value="Edit" onclick="editRow(this)">' +"</td></tr>");
                          }
                        // $("#emails").html(document.getElementById("emails").innerHTML + "<li>" +data._id + "   "+data.compEmailTitle + "   "+data.compEmail+ "   "+data.compEmailDes+  '<input name='+data._id+' type="button" value="-" onclick="removeRow(this)">'+ '<input name=e'+data._id+' type="button" value="-" onclick="editRow(this)">'+ "</li>");
                         document.getElementById("email").reset();
                         $("#btnSaveEmail").val("Save");
                          eid ="";

                    },
                    error: function(jqXHR, textStatus, errorThrown) 
                    {
                        //$("#simple-msg").html('<pre><code class="prettyprint">AJAX Request Failed<br/> textStatus='+textStatus+', errorThrown='+errorThrown+'</code></pre>');
                        alert(errorThrown + "   td = " + textStatus);
                    }
                });
                e.preventDefault(); //STOP default action
                e.unbind();
            });
            $("#email").submit(); //SUBMIT FORM
          }else{
                    alert("There is no branch for this company. Please add a branch to proceed.");
                  }
        }else{
                  alert("Oops! You forgot to add the company. Please add a company first.")
                }
    });


$("#btnSaveLC").click(function()
  {
    if((document.getElementById("company").action).indexOf("id:") >= 0)
    {
      if($("#branches").length >0)
      {

          var fcid="";
          var fbcid="";
              fcid =(document.getElementById("company").action).split("id:")[1];
              fbcid = document.getElementsByName("branches")[0].rows[document.getElementsByName("branches")[0].rows.length-1].cells[12].firstChild.name;//($("#branches").find("li")[($("#branches").find("li").length-1)]).id;

            $("#chat").submit(function(e)
              {
                  var postData = $(this).serializeArray();
                    postData.push({"name":"cid","value":fcid});
                    postData.push({"name":"bcid","value":fbcid});
                    postData.push({"name":"lcid","value":lcid});
                  var formURL = $(this).attr("action");
                  var formMethod = $(this).attr("method");
                  $.ajax(
                  {
                      url : formURL,
                      type: "POST",
                      data : postData,
                      dataType: "json",
                      success:function(data, textStatus, jqXHR) 
                      {
                        if(lcid.length > 0)
                          {
                            $(document.getElementsByName(lcid)[0].parentNode.parentNode).replaceWith("<tr><td>"+data.compLiveChatTitle +"</td><td>"+ data.compLiveChatname +"</td><td>"+ data.complivechatDes +"</td><td>"+ data.percentResolvedChat +"</td><td>"+ data.avgWaitTimeChat +"</td><td>"+ '<input name='+data._id+' type="button" value="X" onclick="removeRow(this)">' +"</td><td>"+ '<input name=e'+data._id+' type="button" value="Edit" onclick="editRow(this)">' +"</td></tr>");
                          }
                          else
                          {
                            $("#chats").append("<tr><td>"+data.compLiveChatTitle +"</td><td>"+ data.compLiveChatname +"</td><td>"+ data.complivechatDes +"</td><td>"+ data.percentResolvedChat +"</td><td>"+ data.avgWaitTimeChat +"</td><td>"+ '<input name='+data._id+' type="button" value="X" onclick="removeRow(this)">' +"</td><td>"+ '<input name=e'+data._id+' type="button" value="Edit" onclick="editRow(this)">' +"</td></tr>");
                          }
                         // $("#chats").html(document.getElementById("chats").innerHTML + "<li>" +data._id + "   "+data.compLiveChatTitle + "   "+data.compLiveChat+ "   "+data.complivechatDes+  '<input name='+data._id+' type="button" value="-" onclick="removeRow(this)">'+ '<input name=e'+data._id+' type="button" value="-" onclick="editRow(this)">'+ "</li>");
                          document.getElementById("chat").reset();
                          $("#btnSaveLC").val("Save");
                          lcid ="";
                      },
                      error: function(jqXHR, textStatus, errorThrown) 
                      {
                          //$("#simple-msg").html('<pre><code class="prettyprint">AJAX Request Failed<br/> textStatus='+textStatus+', errorThrown='+errorThrown+'</code></pre>');
                          alert(errorThrown + "   td = " + textStatus);
                      }
                  });
                  e.preventDefault(); //STOP default action
                  e.unbind();
              });
              $("#chat").submit(); //SUBMIT FORM
            }else{
                      alert("There is no branch for this company. Please add a branch to proceed.");
                    }
        }else{
        alert("Oops! You forgot to add the company. Please add a company first.")
      }
    });


$("#btnSaveHelp").click(function()
  {
    if((document.getElementById("company").action).indexOf("id:") >= 0)
    {
      if($("#branches").length >0)
      {
          var fcid="";
          var fbcid="";
              fcid =(document.getElementById("company").action).split("id:")[1];
              fbcid = document.getElementsByName("branches")[0].rows[document.getElementsByName("branches")[0].rows.length-1].cells[12].firstChild.name;
              //bcid ;//($("#branches").find("li")[($("#branches").find("li").length-1)]).id;
            $("#olhelp").submit(function(e)
              {
                var postData = $(this).serializeArray();
                postData.push({"name":"cid","value":fcid});
                postData.push({"name":"bcid","value":fbcid});
                postData.push({"name":"olhid","value":olhid});
                //alert(JSON.stringify(postData));
                  //var postData = $(this).serializeArray();
                  var formURL = $(this).attr("action");
                  var formMethod = $(this).attr("method");
                  $.ajax(
                  {
                      url : formURL,
                      type: "POST",
                      data : postData,
                      dataType: "json",
                      success:function(data, textStatus, jqXHR) 
                      {   
                          if(olhid.length > 0)
                          {
                            $(document.getElementsByName(olhid)[0].parentNode.parentNode).replaceWith("<tr><td>"+data.compOnlineHelpTitle +"</td><td>"+ data.compOnlineHelp +"</td><td>"+ data.compOnlienHelpDes +"</td><td>"+ data.percentResolvedOnline +"</td><td>"+ data.avgWaitTimeOnline +"</td><td>"+ '<input name='+data._id+' type="button" value="X" onclick="removeRow(this)">' +"</td><td>"+ '<input name=e'+data._id+' type="button" value="Edit" onclick="editRow(this)">' +"</td></tr>");
                          }
                          else
                          {
                            $("#olhelps").append("<tr><td>"+data.compOnlineHelpTitle +"</td><td>"+ data.compOnlineHelp +"</td><td>"+ data.compOnlienHelpDes +"</td><td>"+ data.percentResolvedOnline +"</td><td>"+ data.avgWaitTimeOnline +"</td><td>"+ '<input name='+data._id+' type="button" value="X" onclick="removeRow(this)">' +"</td><td>"+ '<input name=e'+data._id+' type="button" value="Edit" onclick="editRow(this)">' +"</td></tr>");
                          }
                         //correct //$("#olhelps").append("<tr><td>"+data.compOnlineHelpTitle +"</td><td>"+ data.compOnlineHelp +"</td><td>"+ data.compOnlienHelpDes +"</td><td>"+ data.percentResolvedOnline +"</td><td>"+ data.avgWaitTimeOnline +"</td><td>"+ '<input name='+data._id+' type="button" value="X" onclick="removeRow(this)">' +"</td><td>"+ '<input name=e'+data._id+' type="button" value="Edit" onclick="editRow(this)">' +"</td></tr>");
                          document.getElementById("olhelp").reset();
                          $("#btnSaveHelp").val("Save");
                          olhid ="";
                      },
                      error: function(jqXHR, textStatus, errorThrown) 
                      {
                          //$("#simple-msg").html('<pre><code class="prettyprint">AJAX Request Failed<br/> textStatus='+textStatus+', errorThrown='+errorThrown+'</code></pre>');
                          alert(errorThrown + "   td = " + textStatus);
                      }
                  });
                  e.preventDefault(); //STOP default action
                  e.unbind();
              });
              $("#olhelp").submit(); //SUBMIT FORM
            }else{
                      alert("There is no branch for this company. Please add a branch to proceed.");
                    }
        }else{
                alert("Oops! You forgot to add the company. Please add a company first.")
                }
    });

});

var bcid ="";
var phid ="";
var eid ="";
var lcid ="";
var olhid ="";

function editRow(input) {
  var curRow = input.parentNode.parentNode;
  switch(input.parentNode.parentNode.parentNode.parentNode.id){
    case "branches":{
        branchName.value = curRow.cells[0].innerHTML;
        branchUrl.value = curRow.cells[1].innerHTML;
        addressline1.value = curRow.cells[2].innerHTML;
        addressline2.value = curRow.cells[3].innerHTML;
        city.value = curRow.cells[4].innerHTML;
        state.value = curRow.cells[5].innerHTML;
        country.value = curRow.cells[6].innerHTML;
        zipcode.value = curRow.cells[7].innerHTML;
        pagetitle.value = curRow.cells[8].innerHTML;
        metatitle.value = curRow.cells[9].innerHTML;
        metadescription.value = curRow.cells[10].innerHTML;
        metakeywords.value = curRow.cells[11].innerHTML;
        bcid  = input.name;
        $("#btnSaveBranch").val("update");
    } break;
    case "phones":{
        compPhoneTitle.value = curRow.cells[0].innerHTML; 
        compPhoneNumber.value = curRow.cells[1].innerHTML;
        compPhoneDes.value = curRow.cells[2].innerHTML;
        callingInstructions.value = curRow.cells[3].innerHTML;
        //ckMon.value = curRow.cells[4].innerHTML;        
        if(curRow.cells[4].innerHTML =="1")
          $("#ckMon").prop('checked', true);
        fromMon.value = curRow.cells[5].innerHTML;
        toMon.value = curRow.cells[6].innerHTML;
        //ckTue.value = curRow.cells[7].innerHTML;
        if(curRow.cells[7].innerHTML =="1")
          $("#ckTue").prop('checked', true);
        fromTue.value = curRow.cells[8].innerHTML;
        toTue.value = curRow.cells[9].innerHTML;
        //ckWed.value = curRow.cells[10].innerHTML;
        if(curRow.cells[10].innerHTML =="1")
          $("#ckWed").prop('checked', true);
        fromWed.value = curRow.cells[11].innerHTML;
        toWed.value = curRow.cells[12].innerHTML;
        //ckThu.value = curRow.cells[13].innerHTML;
        if(curRow.cells[13].innerHTML =="1")
          $("#ckThu").prop('checked', true);
        fromThu.value = curRow.cells[14].innerHTML;
        toThu.value = curRow.cells[15].innerHTML;
        //ckFri.value = curRow.cells[16].innerHTML;
        if(curRow.cells[16].innerHTML =="1")
          $("#ckFri").prop('checked', true);
        fromFri.value = curRow.cells[17].innerHTML;
        toFri.value = curRow.cells[18].innerHTML;
        //ckSat.value = curRow.cells[19].innerHTML;
        if(curRow.cells[19].innerHTML =="1")
          $("#ckSat").prop('checked', true);
        fromSat.value = curRow.cells[20].innerHTML;
        toSat.value = curRow.cells[21].innerHTML;
        //ckSun.value = curRow.cells[22].innerHTML;
        if(curRow.cells[22].innerHTML =="1")
          $("#ckSun").prop('checked', true);
        fromSun.value = curRow.cells[23].innerHTML;
        toSun.value = curRow.cells[24].innerHTML;
        percentResolved.value = curRow.cells[25].innerHTML;
        avgWaitTime.value = curRow.cells[26].innerHTML;
        phid  = input.name;
        $("#btnSavePhone").val("Update");

    } break;
    case "emails":{
        compEmailTitle.value = curRow.cells[0].innerHTML;
        compEmailname.value = curRow.cells[1].innerHTML;
        compEmailDes.value = curRow.cells[2].innerHTML;
        percentResolvedMail.value = curRow.cells[3].innerHTML;
        avgWaitTimeMail.value = curRow.cells[4].innerHTML;
        eid  = input.name;
        $("#btnSaveEmail").val("Update");
    } break;
    case "chats":{
        compLiveChatTitle.value= curRow.cells[0].innerHTML;
        compLiveChatname.value = curRow.cells[1].innerHTML;
        complivechatDes.value= curRow.cells[2].innerHTML;
        percentResolvedChat.value= curRow.cells[3].innerHTML;
        avgWaitTimeChat.value= curRow.cells[4].innerHTML;
        lcid  = input.name;
        $("#btnSaveLC").val("Update");
    } break;
    case "olhelps":{
        compOnlineHelpTitle.value = curRow.cells[0].innerHTML;
        compOnlineHelp.value = curRow.cells[1].innerHTML;
        compOnlienHelpDes.value = curRow.cells[2].innerHTML;
        percentResolvedOnline.value = curRow.cells[3].innerHTML;
        avgWaitTimeOnline.value = curRow.cells[4].innerHTML;
        olhid = input.name;
        $("#btnSaveHelp").val("update");
    } break;
  }
}

function removeRow(input) {
  switch(input.parentNode.parentNode.parentNode.parentNode.id)
  { //TBD - Add delete functionality
    case "branches":{
      } break;
    case "phones":{
        document.getElementById("phone").reset();
        $("#btnSaveLC").val("Save");
        phid="";
      } break;
    case "emails":{
        document.getElementById("email").reset();
        $("#btnSaveEmail").val("Save");
        eid ="";
      } break;
    case "chats":{
        document.getElementById("chat").reset();
        $("#btnSaveLC").val("Save");
        lcid ="";
      } break;
    case "olhelps":{
        document.getElementById("olhelp").reset();
        $("#btnSaveHelp").val("Save");
        olhid ="";
      } break;
  }
  input.parentNode.parentNode.parentNode.removeChild(input.parentNode.parentNode) ;
}

function RegClkPC()
{
    $(document).on("click", '#btnSaveComp', function(event) 
    { 
        $("#company").submit(function(e)
        {

            var formURL = $(this).attr("action");
            var postData = $(this).serializeArray();
            var formMethod = $(this).attr("method");
            $.ajax({
               url: formURL,
               data : postData,
               error: function(jqXHR, textStatus, errorThrown) {
                        alert(errorThrown + "  ts=   "+ textStatus);
               },
               success: function(data) {
                  //success actions
                  $("#divCompany").html(data);
                   //RegClkPvC();
                   if( typeof document.getElementById("compName").value != 'undefined')
                   {
                        $("#cN").html("<span>"+ document.getElementById("compName").value +"</span>");
                   }else
                   {
                        $("#cN").html("<span>"+ document.getElementById("compName").innerHTML +"</span>");
                   }
               },
               //type: 'GET'
               type: formMethod
            });        
            
            e.preventDefault(); //STOP default action
            e.unbind();
        });
         $("#company").submit();
    });
}

