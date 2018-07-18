$('.section').hide();

setTimeout(function() {
    $(document).ready(function() {
        $('.preload').fadeOut();
        $('.section').fadeIn();
        $(".button-collapse").sideNav();
        $('.count').each(function() {
            $(this).prop('Counter', 0).animate({
                Counter: $(this).text()
            },{
                duration: 1000,
                easing: 'swing',
                step: function(now) {
                    $(this).text(Math.ceil(now));
                }
            })
        });
        chart.render();
        });
        $('.approve').click(function(e){
            Materialize.toast('Approve this comment', 3000);
            e.preventDefault();
        })
        $('.deny').click(function(e){
            Materialize.toast('Deny this comment', 3000);
            e.preventDefault();
        })
        $('.todo-forms').submit(function(e){
            const newTodo = `<li class="collection-item">
                                <div>${ $('#todo').val()}
                                    <a href="#!" class="secondary-content delete">
                                        <i class="material-icons">close</i> 
                                    </a>
                                </div>
                            </li>`;
            $('.todo-list').append(newTodo);
            Materialize.toast("Added new Todo", 3000);
            e.preventDefault();
        })
        $('.todo-list').on('click','.delete', function(e) {
            $(this).parent().parent().remove();
            Materialize.toast('Todo Deleted', 3000);
            e.preventDefault();
        })
},1000);
var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    title:{
        text: "Daily Visitors"
    },
    axisY:{
        includeZero: false
    },
    data: [{        
        type: "line",       
        dataPoints: [
            { y: 450 },
            { y: 414},
            { y: 520, indexLabel: "highest",markerColor: "red", markerType: "triangle" },
            { y: 460 },
            { y: 450 },
            { y: 500 },
            { y: 480 },
            { y: 480 },
            { y: 410 , indexLabel: "lowest",markerColor: "DarkSlateGrey", markerType: "cross" },
            { y: 500 },
            { y: 480 },
            { y: 510 }
        ]
    }]
});



