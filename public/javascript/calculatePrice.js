//make array with snow, shoveljob, size
let priceInfo = [ //snowfall is 1~12
                15,20,25, //sidewalk
                10,15,20, //driveway
                5,10,15, //walkway
                5,10,15, //stairsway
                20,25,30, 15,20,25, 10,15,20, 10,15,20, //snowfall is 13~18
                25,30,35, 20,25,30, 15,20,25, 15,20,25 //snowfall is over 18
                ];
let price = $('.listingPrice');

function calculatePrice() {
  //detect current status
  
  let index = snowfall_number = 0;
  let total_price = 0;
  let sidewalk_price = driveway_price = walkway_price = stairs_price = 0;
  let snowfall = parseInt($('.snowfall').val());
  snowfall_number = snowfall * 12;

  if (!$("select[name='sidewalkSize']").is(":disabled")) {
    let sidewalk_size = parseInt($("select[name='sidewalkSize']").val());
    index = snowfall_number + sidewalk_size;
    sidewalk_price = priceInfo[index];
  }
  if (!$("select[name='drivewaySize']").is(":disabled")) {
    let driveway_size = parseInt($("select[name='drivewaySize']").val());
    index = snowfall_number + driveway_size + 3;
    driveway_price = priceInfo[index];
  }
  if (!$("select[name='walkwaySize']").is(":disabled")) {
    let walkway_size = parseInt($("select[name='walkwaySize']").val());
    index = snowfall_number + walkway_size + 6;
    walkway_price = priceInfo[index];
  }
  if (!$("select[name='stairsSize']").is(":disabled")) {
    let stairs_size = parseInt($("select[name='stairsSize']").val());
    index = snowfall_number + stairs_size + 9;
    stairs_price = priceInfo[index];
  }

  total_price = sidewalk_price + driveway_price + walkway_price + stairs_price;
  let string_price = total_price.toString() + '.00';
  price.val(string_price);
}
//change checkboxes
$("input[name='sidewalk']").change(function() {
  if (this.checked) {
    $("select[name='sidewalkSize']").prop('disabled', false);
  } else {
    $("select[name='sidewalkSize']").prop('disabled', true);
  }
  calculatePrice();
})

$("input[name='driveway']").change(function() {
  if (this.checked) {
    $("select[name='drivewaySize']").prop('disabled', false);
  } else {
    $("select[name='drivewaySize']").prop('disabled', true);
  }
  calculatePrice();
})
$("input[name='walkway']").change(function() {
  if (this.checked) {
    $("select[name='walkwaySize']").prop('disabled', false);
  } else {
    $("select[name='walkwaySize']").prop('disabled', true);
  }
  calculatePrice()
})
$("input[name='stairs']").change(function() {
  if (this.checked) {
    $("select[name='stairsSize']").prop('disabled', false);
  } else {
    $("select[name='stairsSize']").prop('disabled', true);
  }
  calculatePrice()
})

$('.snowfall').change(calculatePrice)
$(".job_size").change(calculatePrice);