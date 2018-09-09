(function(window) {
  function Calendar(target, options, setWork) {
    var date
    var data = options.data||[];
    var isAllMark = options.isMark||false;
    var calendar
    var container
    var top = options.top//必填选项，如果没有
    switch (typeof options.date) {
      case 'string':
        date = options.date.split('-');
        date = new Date(date[0], date[1]);
        break
      case 'undefined':
        date = new Date()
        break
      case 'object':
        date = options.date
        break
      default:
        throw 'Invalid date type!'
    }
    // console.log(moment(date).month());
    // date = moment(moment(date).format('YYYY-MM').split('-'));
    // console.log(date.year());
    date = moment(date).add(1, 'month');
    // date = moment(date).format('YYYY-MM').split('-');
    container = document.getElementById(target.slice(1))
    calendar = buildTable(date.year(), date.month());
    // calendar = buildTable(date[0], date[1]);
    // if(top) {
    //   container.appendChild(buildControls(date, top))
    // }
    container.appendChild(calendar)
    function buildTable(year, month) {
      var controlDate = new Date(year, month, 0);
      var currDate = new Date(year, month - 1, 1)
      var iter = 0
      var ready = true

      var table = newElement('div')
      var now = newElement('div')
      var thead = newElement('div')
      thead.className = 'thead'
      var tbody = newElement('div')
      tbody.className = 'tbody'
      var tr
      if (currDate.getDay() !== 0) {
        iter = 0 - currDate.getDay()
      }
      while (ready) {
        // if (window.CP.shouldStopExecution(1)){break;}
        if (currDate.getDay() === 6) {
          if (tr) {
            tbody.appendChild(tr)
          }
          tr = null
        }

        if (!tr) {
          tr = newElement('ul');
          tr.className = 'day-body border-b'
        }
        currDate = new Date(year, month - 1, ++iter)
        tr.appendChild(newDayCell(currDate, iter < 1 || +currDate > +controlDate))
        if (+controlDate < +currDate && currDate.getDay() === 0) {
          ready = false
        }

      }
// window.CP.exitedLoop(1);

      thead.innerHTML = '<ul class="day-header">' +
        '<li class="day holiday">日</li>' +
        '<li class="day">一</li>' +
        '<li class="day">二</li>' +
        '<li class="day">三</li>' +
        '<li class="day">四</li>' +
        '<li class="day">五</li>' +
        '<li class="day holiday">六</li>' +
        '</ul>'
      now.className = 'now-date';
      now.innerHTML = moment(controlDate).format('YYYY年MM月')
      thead.appendChild(now)
      table.appendChild(thead)
      
      table.appendChild(now)
      table.appendChild(tbody)
      table.className = 'calendar'
      table.setAttribute('cellspacing', 0)
      table.setAttribute('cellpadding', 0)
      table.setAttribute('data-period', currDate.getFullYear() + '-' + (currDate.getMonth()))
      return table
    }

    function newDayCell(dateObj, isOffset) {
      var today =  moment(new Date().getTime()).format('YYYY-MM-DD');
      var td = newElement('li')
      var number = newElement('span')
      var isoDate = dateObj.toISOString();
      var isWeekend = moment(isoDate).format('dddd');
      var otherDate = [];
      isoDate = moment(isoDate).format('YYYY-MM-DD');
      number.innerHTML = dateObj.getDate();
      // console.log(today == isoDate);
      td.className = isOffset? 
                     'day adj-month' 
                     :
                     today == isoDate?
                     'day today': 
                     isWeekend == 'Sunday'||isWeekend == 'Saturday'?
                     'day holiday'
                     :
                     'day'

      td.setAttribute('data-date', isoDate)
      td.appendChild(number)
      
      for (var i = 0; i < data.length; i++) {
        // if (window.CP.shouldStopExecution(2)){break;}
        if (data[i].date === isoDate) {
          otherDate.push(data[i].date)
          if(data[i].color) {
            colorMark(td, data[i].color)
          }
          if(data[i].imgUrl) {
            imgMark(td, data[i].imgUrl)
          }
          if(data[i].text) {
            textMark(td, data[i].text)
          }
        }
      }
      if(otherDate.indexOf(isoDate) < 0) {
        if(isAllMark) {
          imgMark(td, '../../image/setwork-all.png');
        }
      }
// window.CP.exitedLoop(2);
      return td
    }

    function newElement(tagName) {
      return document.createElement(tagName)
    }
// mark types
    function colorMark(target, color) {
      var item = newElement('span')
      item.style.backgroundColor = color
      item.className = 'calendar-mark-color'
      target.appendChild(item)
    }
    function imgMark(target, url) {
      var item = newElement('img')
      item.src = url
      item.className = 'calendar-mark-img'
      target.appendChild(item)
    }
    function textMark(target, text) {
      var item = newElement('span')
      item.innerHTML = text
      item.className = 'calendar-mark-text'
      target.appendChild(item)
    }
// 创建一个控制器用于切换上下月
/**
* top: [
    {
      title: String, //如果是起始时间选择那么必填
      month: String||Number, //如果是选择时间那么 必填
      isChangeMonth: Boolen  //必填 起始时间 false 月份切换为 
    }
  ]
*/
    function formatDate(time, index) {
      // time 传入时间， index
      moment(new Date())
    }
    // function buildControls(date, top) {
    //   var div = newElement('div');
    //   div.className = 'calendar-controls border-b'
    //   var currentMonth = moment(new Date().getTime()).format('YYYY-MM');
    //   for (var i = 0; i < top.length; i++) {
    //     var newTab = newElement('div');
    //     newTab.className = currentMonth == top[i].month?
    //                        'calendar-control active border-r'
    //                        :
    //                        'calendar-control border-r'
    //     if(top[i].isChangeMonth) {
    //       newTab.setAttribute('data-calendar-control', top[i].month);
    //       newTab.innerHTML = currentMonth == top[i].month? 
    //                          '当月'
    //                          :
    //                          moment(top[i].month).format('MM') + '月';
    //       div.appendChild(newTab)
    //     } else {
    //       newTab.setAttribute('data-calendar-control', top[i].title)
    //       newTab.innerHTML = top[i].title;
    //       div.appendChild(newTab)
    //     }
    //   }
      // removeEventListener(document, 'click', calendarControlClick)
      // addEventListener(document, 'click', calendarControlClick)

      // function calendarControlClick(evt) {
      //   evt.preventDefault()
      //   var target = evt.target
        
        // while (target.parentNode) {
        //   // if (window.CP.shouldStopExecution(3)){break;}
        //   if (target.parentNode === container) {
        //     break;
        //   }
        //   console.log(evt.target);
        //   target = target.parentNode
          
        //   if (!target) {
        //     return
        //   }
        // }
// window.CP.exitedLoop(3);
    //     if (evt.target.getAttribute('data-calendar-control')) {
    //       if($(evt.target).is('.active')) return;
    //       $(evt.target).siblings().removeClass('active')
    //       $(evt.target).addClass('active')
    //       var dateset = evt.target.getAttribute('data-calendar-control')
    //       date = moment(dateset.split('-'));
    //       calendar = buildTable(date.year(), date.month())
    //       container.removeChild(container.lastChild)
    //       container.appendChild(calendar)
    //       changeTab(dateset)
    //       return;
    //     } 

    //   }
      
    //   return div
    // }
    removeEventListener(document, 'click', setWorkTime)
    addEventListener(document, 'click', setWorkTime)
    function setWorkTime(evt) {
      removeEventListener(document, 'click', setWorkTime)
      evt.preventDefault()
      var target = evt.target;
      if($(target).is('.calendar-control')) return;
      if(tolower(target.nodeName) == 'ul') return;
      if($(target).parent()&&(tolower($(target).parent()[0].nodeName) == 'li')) {
        target = $(target).parent()[0];
        setWork(target.dataset.date, function() {
          addEventListener(document, 'click', setWorkTime)
        })
        return;
      } 
      if($(target).parent()&&(tolower(target.nodeName) == 'li')) {
        target = target;
        setWork(target.dataset.date)
        return;
      }
    }
    function addEventListener(target, event, handler) {

      if (document.addEventListener) {
        target.addEventListener(event, handler, false)
      } else {
        target.attachEvent('on' + event, handler)
      }

    }
    function tolower(text) {

      return text.toLowerCase();
    }
    function removeEventListener(target, event, handler) {

      if (document.removeEventListener) {
        target.removeEventListener(event, handler, false)
      } else {
        target.detachEvent('on' + event, handler)
      }

    }
  }

  window.calendar = Calendar

})(window);