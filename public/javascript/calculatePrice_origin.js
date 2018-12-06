let price = $('.listingPrice');

$('.shovel-job').change(function() {
  let shovelJobSize = $('.shovel-job-size').val();
  let snowfall = $('.snowfall').val();

  $('.shovel-job-size').empty();
  $('.shovel-job-size').append($('<option></option>'));
  let choice = $(this).val();

  if (choice === 'sidewalk') {
    $('.shovel-job-size').append(
      $('<option></option>')
        .attr('value', 'small')
        .text('Small (10’-20’ ft. wide)')
    );
    $('.shovel-job-size').append(
      $('<option></option>')
        .attr('value', 'medium')
        .text('Medium (21’-40’ ft. wide)')
    );
    $('.shovel-job-size').append(
      $('<option></option>')
        .attr('value', 'large')
        .text('Large (41’ or more ft. wide')
    );

    if (shovelJobSize === 'small') {
      switch (snowfall) {
        case '1-12':
          price.val('15.00');
          break;
        case '13-18':
          price.val('20.00');
          break;
        case '19':
          price.val('25.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJobSize === 'medium') {
      switch (snowfall) {
        case '1-12':
          price.val('20.00');
          break;
        case '13-18':
          price.val('25.00');
          break;
        case '19':
          price.val('30.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJobSize === 'large') {
      switch (snowfall) {
        case '1-12':
          price.val('25.00');
          break;
        case '13-18':
          price.val('30.00');
          break;
        case '19':
          price.val('35.00');
          break;
        default:
          price.val('0.00');
      }
    }
  }

  if (choice === 'driveway') {
    $('.shovel-job-size').append(
      $('<option></option>')
        .attr('value', 'small')
        .text('Small (10’-15’ ft. length)')
    );
    $('.shovel-job-size').append(
      $('<option></option>')
        .attr('value', 'medium')
        .text('Medium (16’-25’ ft. length)')
    );
    $('.shovel-job-size').append(
      $('<option></option>')
        .attr('value', 'large')
        .text('Large (26’ or more ft. length)')
    );

    if (shovelJobSize === 'small') {
      switch (snowfall) {
        case '1-12':
          price.val('10.00');
          break;
        case '13-18':
          price.val('15.00');
          break;
        case '19':
          price.val('20.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJobSize === 'medium') {
      switch (snowfall) {
        case '1-12':
          price.val('15.00');
          break;
        case '13-18':
          price.val('20.00');
          break;
        case '19':
          price.val('25.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJobSize === 'large') {
      switch (snowfall) {
        case '1-12':
          price.val('20.00');
          break;
        case '13-18':
          price.val('25.00');
          break;
        case '19':
          price.val('30.00');
          break;
        default:
          price.val('0.00');
      }
    }
  }

  if (choice === 'walkway') {
    $('.shovel-job-size').append(
      $('<option></option>')
        .attr('value', 'small')
        .text('Small (5’-15’ ft. length)')
    );
    $('.shovel-job-size').append(
      $('<option></option>')
        .attr('value', 'medium')
        .text('Medium (16’-25’ ft. length)')
    );
    $('.shovel-job-size').append(
      $('<option></option>')
        .attr('value', 'large')
        .text('Large (26’ or more ft. length)')
    );

    if (shovelJobSize === 'small') {
      switch (snowfall) {
        case '1-12':
          price.val('5.00');
          break;
        case '13-18':
          price.val('10.00');
          break;
        case '19':
          price.val('15.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJobSize === 'medium') {
      switch (snowfall) {
        case '1-12':
          price.val('10.00');
          break;
        case '13-18':
          price.val('15.00');
          break;
        case '19':
          price.val('20.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJobSize === 'large') {
      switch (snowfall) {
        case '1-12':
          price.val('15.00');
          break;
        case '13-18':
          price.val('20.00');
          break;
        case '19':
          price.val('25.00');
          break;
        default:
          price.val('0.00');
      }
    }
  }

  if (choice === 'stairs') {
    $('.shovel-job-size').append(
      $('<option></option>')
        .attr('value', 'small')
        .text('Small (5 steps or less)')
    );
    $('.shovel-job-size').append(
      $('<option></option>')
        .attr('value', 'medium')
        .text('Medium (6-10 steps)')
    );
    $('.shovel-job-size').append(
      $('<option></option>')
        .attr('value', 'large')
        .text('Large (11 or more steps)')
    );

    if (shovelJobSize === 'small') {
      switch (snowfall) {
        case '1-12':
          price.val('5.00');
          break;
        case '13-18':
          price.val('10.00');
          break;
        case '19':
          price.val('15.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJobSize === 'medium') {
      switch (snowfall) {
        case '1-12':
          price.val('10.00');
          break;
        case '13-18':
          price.val('15.00');
          break;
        case '19':
          price.val('20.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJobSize === 'large') {
      switch (snowfall) {
        case '1-12':
          price.val('15.00');
          break;
        case '13-18':
          price.val('20.00');
          break;
        case '19':
          price.val('25.00');
          break;
        default:
          price.val('0.00');
      }
    }
  }
});

$('.shovel-job-size').change(function() {
  let choice = $(this).val();
  let shovelJob = $('.shovel-job').val();
  let snowfall = $('.snowfall').val();

  if (choice === 'small') {
    if (shovelJob == 'sidewalk') {
      switch (snowfall) {
        case '1-12':
          price.val('15.00');
          break;
        case '13-18':
          price.val('20.00');
          break;
        case '19':
          price.val('25.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'driveway') {
      switch (snowfall) {
        case '1-12':
          price.val('10.00');
          break;
        case '13-18':
          price.val('15.00');
          break;
        case '19':
          price.val('20.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'walkway') {
      switch (snowfall) {
        case '1-12':
          price.val('5.00');
          break;
        case '13-18':
          price.val('10.00');
          break;
        case '19':
          price.val('15.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'stairs') {
      switch (snowfall) {
        case '1-12':
          price.val('5.00');
          break;
        case '13-18':
          price.val('10.00');
          break;
        case '19':
          price.val('15.00');
          break;
        default:
          price.val('0.00');
      }
    }
  } else if (choice === 'medium') {
    if (shovelJob == 'sidewalk') {
      switch (snowfall) {
        case '1-12':
          price.val('20.00');
          break;
        case '13-18':
          price.val('25.00');
          break;
        case '19':
          price.val('30.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'driveway') {
      switch (snowfall) {
        case '1-12':
          price.val('15.00');
          break;
        case '13-18':
          price.val('20.00');
          break;
        case '19':
          price.val('25.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'walkway') {
      switch (snowfall) {
        case '1-12':
          price.val('10.00');
          break;
        case '13-18':
          price.val('15.00');
          break;
        case '19':
          price.val('25.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'stairs') {
      switch (snowfall) {
        case '1-12':
          price.val('10.00');
          break;
        case '13-18':
          price.val('15.00');
          break;
        case '19':
          price.val('20.00');
          break;
        default:
          price.val('0.00');
      }
    }
  } else if (choice === 'large') {
    if (shovelJob == 'sidewalk') {
      switch (snowfall) {
        case '1-12':
          price.val('25.00');
          break;
        case '13-18':
          price.val('30.00');
          break;
        case '19':
          price.val('35.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'driveway') {
      switch (snowfall) {
        case '1-12':
          price.val('20.00');
          break;
        case '13-18':
          price.val('25.00');
          break;
        case '19':
          price.val('30.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'walkway') {
      switch (snowfall) {
        case '1-12':
          price.val('15.00');
          break;
        case '13-18':
          price.val('20.00');
          break;
        case '19':
          price.val('25.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'stairs') {
      switch (snowfall) {
        case '1-12':
          price.val('15.00');
          break;
        case '13-18':
          price.val('20.00');
          break;
        case '19':
          price.val('25.00');
          break;
        default:
          price.val('0.00');
      }
    }
  }
});

$('.snowfall').change(function() {
  let choice = $(this).val();
  let shovelJob = $('.shovel-job').val();
  let shovelJobSize = $('.shovel-job-size').val();

  if (choice == '1-12') {
    if (shovelJob == 'sidewalk') {
      switch (shovelJobSize) {
        case 'small':
          price.val('15.00');
          break;
        case 'medium':
          price.val('20.00');
          break;
        case 'large':
          price.val('25.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'driveway') {
      switch (shovelJobSize) {
        case 'small':
          price.val('10.00');
          break;
        case 'medium':
          price.val('15.00');
          break;
        case 'large':
          price.val('20.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'walkway') {
      switch (shovelJobSize) {
        case 'small':
          price.val('5.00');
          break;
        case 'medium':
          price.val('10.00');
          break;
        case 'large':
          price.val('15.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'stairs') {
      switch (shovelJobSize) {
        case 'small':
          price.val('5.00');
          break;
        case 'medium':
          price.val('10.00');
          break;
        case 'large':
          price.val('15.00');
          break;
        default:
          price.val('0.00');
      }
    }
  } else if (choice == '13-18') {
    if (shovelJob == 'sidewalk') {
      switch (shovelJobSize) {
        case 'small':
          price.val('20.00');
          break;
        case 'medium':
          price.val('25.00');
          break;
        case 'large':
          price.val('30.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'driveway') {
      switch (shovelJobSize) {
        case 'small':
          price.val('15.00');
          break;
        case 'medium':
          price.val('20.00');
          break;
        case 'large':
          price.val('25.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'walkway') {
      switch (shovelJobSize) {
        case 'small':
          price.val('10.00');
          break;
        case 'medium':
          price.val('15.00');
          break;
        case 'large':
          price.val('20.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'stairs') {
      switch (shovelJobSize) {
        case 'small':
          price.val('10.00');
          break;
        case 'medium':
          price.val('15.00');
          break;
        case 'large':
          price.val('20.00');
          break;
        default:
          price.val('0.00');
      }
    }
  } else if (choice == '19') {
    if (shovelJob == 'sidewalk') {
      switch (shovelJobSize) {
        case 'small':
          price.val('25.00');
          break;
        case 'medium':
          price.val('30.00');
          break;
        case 'large':
          price.val('35.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'driveway') {
      switch (shovelJobSize) {
        case 'small':
          price.val('20.00');
          break;
        case 'medium':
          price.val('25.00');
          break;
        case 'large':
          price.val('30.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'walkway') {
      switch (shovelJobSize) {
        case 'small':
          price.val('15.00');
          break;
        case 'medium':
          price.val('20.00');
          break;
        case 'large':
          price.val('25.00');
          break;
        default:
          price.val('0.00');
      }
    } else if (shovelJob == 'stairs') {
      switch (shovelJobSize) {
        case 'small':
          price.val('15.00');
          break;
        case 'medium':
          price.val('20.00');
          break;
        case 'large':
          price.val('25.00');
          break;
        default:
          price.val('0.00');
      }
    }
  }
});
