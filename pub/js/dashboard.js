(function($) {
  'use strict';
  const colors={
    navy:'#001F3F',
    blue:'#0074D9',
    aqua:'#7FDBFF',
    teal:'#39CCCC',
    olive:'#3D9970',
    green:'#2ECC40',
    lime:'#01FF70',
    yellow:'#FFDC00',
    orange:'#FF851B',
    red:'#FF4136',
    fuchsia:'#F012BE',
    purple:'#B10DC9',
    maroon:'#85144B',
    white:'#FFFFFF',
    silver:'#DDDDDD',
    gray:'#AAAAAA',
    black:'#111111',
    alipay:'#0e9dec',
    wechat:'#346b21',
    unknown:'#f0f1f2',
    merchant:'#ffd500',
    agent:'#fe7096',
    system:'#9a55ff',
  }

  function dateToYM(date) {
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m);
  }

  $(function() {
    Chart.defaults.global.legend.labels.usePointStyle = true;
    var ctx = document.getElementById('visit-sale-chart').getContext("2d");
    
    accIntf('admin/getIncomingByMonth', (err, r)=>{
      if (err) return;
      Chart.defaults.global.legend.labels.usePointStyle = true;
      
      var labels=[], data={}, ds=[];
      r.forEach((ele)=>{
        var prd=ele._id.provider||'unknown';
        if (!data[ele._id.month]) data[ele._id.month]={total:0, count:{total:0}};
        data[ele._id.month][prd]=ele.net;
        data[ele._id.month].total+=ele.net;
        data[ele._id.month].count[prd]=ele.count;
        data[ele._id.month].count.total+=ele.count;
        var s=ds.find(data=>data.label==prd);
        if (!s) {
          s={
            label:prd,
            backgroundColor:colors[prd]||colors.white,
            borderWidth:1,
            data:[]
          };
          ds.push(s);
        }
        s.data.push(ele.net);
      });
      var today=new Date(), thisMonth=dateToYM(new Date());
      var previousMonthDay=new Date();
      previousMonthDay.setMonth(today.getMonth()-1);
      var previousMonth=dateToYM(previousMonthDay);
      var thisMonthIncoming=data[thisMonth]?data[thisMonth].total:0, previousMonthIncoming=data[previousMonth]?data[previousMonth].total:0;
      var ratioMonthly=0;
      if (previousMonthIncoming==0) {
        if (thisMonthIncoming>0) ratioMonthly=2;
        else ratioMonthly=1;
      } else {
        ratioMonthly=thisMonthIncoming/previousMonthIncoming;
      }
      $('#monthlyIncoming').text(formatBigNumber(thisMonthIncoming));
      if (ratioMonthly>=1) $('#monthlyIncomingChanging').text('Increased by '+Math.round((ratioMonthly-1)*10000)/100+'%');
      else $('#monthlyIncomingChanging').text('Decreased by '+Math.round((1-ratioMonthly)*10000)/100+'%');

      var thisMonthBillsCount=data[thisMonth]?data[thisMonth].count.total:0, previousMonthBillsCount=data[previousMonth]?data[previousMonth].count.total:0;
      $('#monthlyOrders').text(formatBigNumber(thisMonthBillsCount));
      var ratioOfCountsChanged=0;
      if (previousMonthBillsCount==0) {
        if (thisMonthBillsCount>0) ratioOfCountsChanged=2;
        else ratioOfCountsChanged=1;
      } else ratioOfCountsChanged=thisMonthBillsCount/previousMonthBillsCount;
      if (ratioOfCountsChanged>=1) $('#monthlyOrdersChanging').text('Increased by '+Math.round((ratioOfCountsChanged-1)*10000)/100+'%');
      else $('#monthlyOrdersChanging').text('Decreased by '+Math.round((1-ratioOfCountsChanged)*10000)/100+'%');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data).sort(),
            datasets: ds
        },
        options: {
          responsive: true,
          legend: false,
          legendCallback: function(chart) {
            var text = []; 
            text.push('<ul>'); 
            for (var i = 0; i < chart.data.datasets.length; i++) { 
                text.push('<li><span class="legend-dots" style="background:' + 
                            (chart.data.datasets[i].legendColor||chart.data.datasets[i].backgroundColor) + 
                            '"></span>'); 
                if (chart.data.datasets[i].label) { 
                    text.push(chart.data.datasets[i].label); 
                } 
                text.push('</li>'); 
            } 
            text.push('</ul>'); 
            return text.join('');
          },
          scales: {
              yAxes: [{
                  ticks: {
                      display: false,
                      min: 0,
                      stepSize: 20,
                      max: 80
                  },
                  gridLines: {
                    drawBorder: false,
                    color: 'rgba(235,237,242,1)',
                    zeroLineColor: 'rgba(235,237,242,1)'
                  }
              }],
              xAxes: [{
                  gridLines: {
                    display:false,
                    drawBorder: false,
                    color: 'rgba(0,0,0,1)',
                    zeroLineColor: 'rgba(235,237,242,1)'
                  },
                  ticks: {
                      padding: 20,
                      fontColor: "#9c9fa6",
                      autoSkip: true,
                  },
                  categoryPercentage: 0.5,
                  barPercentage: 0.5
              }]
            }
          },
          elements: {
            point: {
              radius: 0
            }
          }
      })
      $("#visit-sale-chart-legend").html(myChart.generateLegend());  
    })
    var gradientStrokeBlue = ctx.createLinearGradient(0, 0, 0, 181);
    gradientStrokeBlue.addColorStop(0, 'rgba(54, 215, 232, 1)');
    gradientStrokeBlue.addColorStop(1, 'rgba(177, 148, 250, 1)');
    var gradientLegendBlue = 'linear-gradient(to right, rgba(54, 215, 232, 1), rgba(177, 148, 250, 1))';

    var gradientStrokeRed = ctx.createLinearGradient(0, 0, 0, 50);
    gradientStrokeRed.addColorStop(0, 'rgba(255, 191, 150, 1)');
    gradientStrokeRed.addColorStop(1, 'rgba(254, 112, 150, 1)');
    var gradientLegendRed = 'linear-gradient(to right, rgba(255, 191, 150, 1), rgba(254, 112, 150, 1))';

    var gradientStrokeGreen = ctx.createLinearGradient(0, 0, 0, 300);
    gradientStrokeGreen.addColorStop(0, 'rgba(6, 185, 157, 1)');
    gradientStrokeGreen.addColorStop(1, 'rgba(132, 217, 210, 1)');
    var gradientLegendGreen = 'linear-gradient(to right, rgba(6, 185, 157, 1), rgba(132, 217, 210, 1))';      

    accIntf('admin/getBalanceOverview', (err, rs) =>{
      if (err) return;
      var _in={data:[], bg:[], label:[], total:0}, _out={data:[], bg:[], label:[], total:0};
      for (var k in rs.out) {
        var subtotal=0;
        for (var m in rs.out[k]) {
          subtotal+=rs.out[k][m];
        }
        _out.data.push(subtotal);
        _out.bg.push(colors[k]||colors.white);
        _out.label.push(k);
        _out.total+=subtotal;  
        _in.data.push(0);
        _in.bg.push(colors.white);
      }
      for (var k in rs.in) {
        _in.data.push(rs.in[k].net);
        _in.bg.push(colors[k]||colors.white);
        _in.label.push(k);
        _in.total+=rs.in[k].net;  
      }
      if (_in.total!=_out.total) {
        if (_in.total>_out.total) {
          _out.data.push(_in.total-_out.total);
          _out.bg.push(colors.gray);
          _out.label.push('分账少了');
        } else {
          _in.data.push(_out.total-_in.total);
          _in.bg.push(colors.red);
          _in.label.push('充值少了');
        }
      }
      var trafficChartData = {
        datasets: [
        {
          data:_out.data,
          backgroundColor:_out.bg,
        },
        {
          data: _in.data,
          backgroundColor: _in.bg,
        }
      ],
    
        labels: _out.label.concat(_in.label)
      };
      var trafficChartOptions = {
        responsive: true,
        animation: {
          animateScale: true,
          animateRotate: true
        },
        legend: {position:'top'},
        // legendCallback: function(chart) {
        //   var text = []; 
        //   text.push('<ul>'); 
        //   for (var i = 0; i < trafficChartData.datasets[0].data.length; i++) { 
        //       text.push('<li><span class="legend-dots" style="background:' + 
        //       trafficChartData.datasets[0].legendColor[i] + 
        //                   '"></span>'); 
        //       if (trafficChartData.labels[i]) { 
        //           text.push(trafficChartData.labels[i]); 
        //       }
        //       text.push('<span class="float-right">'+trafficChartData.datasets[0].data[i]+"%"+'</span>')
        //       text.push('</li>'); 
        //   } 
        //   text.push('</ul>'); 
        //   return text.join('');
        // }
      };
      var trafficChartCanvas = $("#traffic-chart").get(0).getContext("2d");
      var trafficChart = new Chart(trafficChartCanvas, {
        type: 'doughnut',
        data: trafficChartData,
        options: trafficChartOptions
      });  
    });
    // $("#traffic-chart-legend").html(trafficChart.generateLegend());
  });
})(jQuery);