    var check_last_point=[];
    var count_check=0;
    var count_check1=0;
    var startelements=[];
    var endelements=[];
    //receive elements here at first and push the into two array--------------------------
    // startelements array contains of all path's starting element
    // endelements array contains of all path's end element
    function dynamicPath(elm1,elm2)
    {
    //Here svg element with path element will be stored in this div elm dynamically
      var div_elm = document.createElement('DIV');
      div_elm.setAttribute('id','svg_contains');
      document.body.appendChild(div_elm);

      startelements.push(elm1);
      endelements.push(elm2);
      create(elm1,elm2);
    }


//This resize event is for change path automatically depending of window size so that it looks responsive----
    window.addEventListener('resize',reDrawPath);
    //For redrwaing path-----------------
    function reDrawPath()
    {
      check_last_point=[];
      count_check=0;
      count_check1=0;
      removePath();
      for(var i=0;i<startelements.length;i++)
      {
        create(startelements[i],endelements[i]);
      }
    }
    //create function start the create the path-----------------------------------------------------------------------------
    //It detects the position of start element and ending element and for good visuailzation add some extra value---
    //It also check already start point and end point is previously used in another path or not if used,
    //then starting point or destination point changes by adding some values.
    function create(elm1,elm2)
    {
        var getXelmfrom=getOffsetLeft(elm1);
        var getYelmfrom=getOffsetTop(elm1);
        getXelmfrom +=elm1.offsetWidth/8;
        var check_point_first=getXelmfrom+","+getYelmfrom;
        while(check_last_point.indexOf(check_point_first)>=0)
        {
          getXelmfrom +=20;
          check_point_first=getXelmfrom+","+getYelmfrom;
        }
        check_last_point.push(check_point_first);
        var getXelmto=getOffsetLeft(elm2);
        var getYelmto=getOffsetTop(elm2);
        getXelmto +=elm2.offsetWidth/8;
        var check_point_last=getXelmto+","+getYelmto;
        while(check_last_point.indexOf(check_point_last)>=0)
        {
          getXelmto +=20;
          check_point_last=getXelmto+","+getYelmto;
        }
        check_last_point.push(check_point_last);
        createPath(getXelmfrom,getYelmfrom,getXelmto,getYelmto);
    }
    //remove all paths------------------------------------------------------------
    function removePath()
    {
      if(document.getElementById('svg_contains').children.length)
      {
        var parentelm=document.getElementById('svg_contains');
        while (parentelm.firstChild)
        {
          parentelm.removeChild(parentelm.firstChild);
        }
      }
    }
    //For getting x position of div element-----------------------------------------
    function getOffsetLeft( elem )
    {
        var offsetLeft = 0;
        do {
                if ( !isNaN( elem.offsetLeft ) )
                {
                    offsetLeft += elem.offsetLeft;
                }
            } while( elem = elem.offsetParent );
        return offsetLeft;
    }
    //for getting y position of div element------------------------------------------
    function getOffsetTop( elem )
    {
        var offsetTop = 0;
        do {
              if ( !isNaN( elem.offsetTop ) )
              {
                  offsetTop += elem.offsetTop;
              }
          } while( elem = elem.offsetParent );
        return offsetTop;
    }
    //For create path all logic-----------------------------------------------------------------
    function createPath(elmXfrom,elmYfrom,elmXto,elmYto) {
          var count_svg=0;
          var startXloop,startYloop,endXloop,endYloop,flag=0;
          startXloop=elmXfrom;
          startYloop=elmYfrom;
          endXloop=elmXto;
          endYloop=elmYto;
          var width_body=document.body.clientWidth;
          var height_body=document.body.clientHeight;
          if(document.getElementById('svg_contains').children.length)
          {
              count_svg=document.getElementById('svg_contains').children.length;
          }
          count_svg++;
          var svg_obj_attrs={
              id     : 'svg'+count_svg,
              style  : 'position:absolute;left:0;top:0',
              width  : width_body+'px',
              height : height_body+'px',
          }
          var path_obj_attrs={
              id     : 'path'+count_svg,
              fill   : 'transparent',
              style  : "stroke-width : 2px",
              stroke : 'red',
          }
          var cr_svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
          var cr_path=document.createElementNS("http://www.w3.org/2000/svg","path");
          for(var attr in svg_obj_attrs)
          {
              cr_svg.setAttribute(attr,svg_obj_attrs[attr]);
          }
          for(var attr in path_obj_attrs)
          {
              cr_path.setAttribute(attr,path_obj_attrs[attr]);
          }
          var  d="M"+elmXfrom+","+elmYfrom+" ";
          if(elmXfrom!=elmXto && elmYfrom==elmYto)
          {
                startYloop -=(8+count_check);
                endYloop -=(8+count_check);
                d+="L"+startXloop+","+startYloop+" ";
          }
          if(elmXfrom!=elmXto && elmYfrom!=elmYto )
          {
                if(elmYfrom<elmYto)
                {
                  endXloop -=(8);
                  endYloop -=(8);
                }
                else
                {
                  endYloop -=(5);
                }
          }
          d +="L"+endXloop+","+endYloop+" ";
          if(elmXfrom!=elmXto && elmYfrom==elmYto)
          {
              endYloop +=(8+count_check);
              d+="L"+endXloop+","+endYloop+" ";
              count_check+=6;
          }
          if(elmXfrom!=elmXto && elmYfrom!=elmYto)
          {
              if(elmYfrom<elmYto)
              {
                endYloop +=(8);
                d+="L"+endXloop+","+endYloop+" ";
              }
              else
              {
               d+="L"+(endXloop+8)+","+endYloop+" L"+(endXloop+8)+","+(endYloop+6)+" ";
               endXloop+=8;
               endYloop+=6;
              }
          }
          if(elmXfrom==elmXto &&  elmYfrom!=elmYto)
          {
              if(elmYfrom>elmYto)
              {
                d+="L"+(endXloop-3)+","+(endYloop+3)+"  M"+endXloop+","+endYloop+" L"+(endXloop+4)+","+(endYloop+4)+" ";
                flag=1;
              }
          }
          if(flag!=1)
          {
              d+="L"+(endXloop-3)+","+(endYloop-3)+"  M"+endXloop+","+endYloop+" L"+(endXloop+3)+","+(endYloop-3);
          }
        cr_path.setAttribute('d',d);
        cr_svg.appendChild(cr_path);
        document.getElementById('svg_contains').appendChild(cr_svg);
    }
