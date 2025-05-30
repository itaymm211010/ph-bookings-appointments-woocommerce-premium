/********* html-ph-booking-add-to-cart.php *********/

jQuery( document ).ready(
	function ($) {

		$is_booking_end_time_clicked     = false;
		$is_booking_end_date_clicked     = false;
		$is_booking_from_time_clicked    = false;
		unavailable_date_after_from_date = false;
		charge_per_night_overrided       = false;

		$date_from_previous_value    = '';
		$ph_date_from_previous_value = '';
		ph_calendar_month            = jQuery( ".callender-month" ).val();
		ph_calendar_year             = jQuery( ".callender-year" ).val();
		ph_current_month             = new Date().toLocaleString('en-US', { month: 'long' });
		ph_current_year              = new Date().getFullYear()

		if ( (ph_calendar_month == ph_current_month) && (ph_calendar_year == ph_current_year) ) {

			jQuery( ".ph-prev" ).hide();
		} else {

			jQuery( ".ph-prev" ).show();
		}

		$( document ).on(
			'click',
			'.single_add_to_cart_button',
			function (e) {
				if ($( this ).hasClass( "disabled" )) {
					e.preventDefault();
				}
				if ($( ".ph-date-from" ).val() == '' && $( ".ph-date-to" ).val() == '') {
					$( ".callender-error-msg" ).html( phive_booking_locale.pick_booking ).focus();
					e.preventDefault();
				} else if ($( ".ph-date-from" ).val() != '' && ! $( '.theme-martfury' ).length && (phive_booking_locale.astra_ajax_add_to_cart != 1)) {
					$( '.ph_book_now_button' ).addClass( "disabled" );
				}
			}
		);

		$( document ).on(
			"click",
			".input-person-minus",
			function (e) {
				e.preventDefault();
				if ( ! $( this ).hasClass( 'input-disabled' )) {
					var $button = $( this );
					flag        = 0;
					min         = $button.parent().find( "input.input-person" ).attr( 'min' );
					e.preventDefault();
					var oldValue = $button.parent().find( "input" ).val();
					if (oldValue > 0) {
						var newVal = parseFloat( oldValue ) - 1;
					} else {
						flag++;
					}
					if (min) {
						if (newVal < min) {
							$button.attr( 'disabled', true );
							$button.css( 'opacity', 0.2 );
							ref_this = '.participant_count_error_' + $button.parent().find( "input.input-person" ).attr( 'rule-key' );

							// console.log(phive_booking_ajax.single_min_participant_warning);
							message = phive_booking_ajax.single_min_participant_warning;
							message = message.replace( '%pname', $button.parent().find( "input.input-person" ).attr( 'data-name' ) );
							message = message.replace( '%min', parseInt( $button.parent().find( "input.input-person" ).attr( "min" ) ) );

							$( ref_this ).html( message );

							$( ref_this ).fadeIn(
								'fast',
								function () {
									$( ref_this ).delay( 5000 ).fadeOut();
								}
							);
							return;
						}
					}
					if (flag == 0) {
						$button.parent().find( ".input-person-plus" ).attr( 'disabled', false );
						$button.parent().find( ".input-person-plus" ).css( 'opacity', 1 );
						$button.parent().find( "input.input-person" ).val( newVal ).change();
					}
				}
			}
		);

		$( document ).on(
			"click",
			".input-person-plus",
			function (e) {
				e.preventDefault();
				if ( ! $( this ).hasClass( 'input-disabled' )) {
					flag         = 0;
					var $button  = $( this );
					var oldValue = $button.parent().find( "input" ).val();
					if ( ! oldValue) {
						oldValue = 0;
					}
					max        = $button.parent().find( "input.input-person" ).attr( 'max' );
					var newVal = parseFloat( oldValue ) + 1;
					if (max) {
						if (newVal > max) {
							$button.attr( 'disabled', true );
							$button.css( 'opacity', 0.2 );
							ref_this = '.participant_count_error_' + $button.parent().find( "input.input-person" ).attr( 'rule-key' );

							var message = phive_booking_locale.max_individual_participant;

							pname   = $button.parent().find( "input.input-person" ).attr( 'data-name' );
							pmax    = parseInt( $button.parent().find( "input.input-person" ).attr( "max" ) );
							message = message.replace( '%pname', pname );
							message = message.replace( '%pmax', pmax );
							$( ref_this ).html( message );
							$( ref_this ).fadeIn(
								'fast',
								function () {
									$( ref_this ).delay( 5000 ).fadeOut();
								}
							);
							return;
							// flag++;
						}
					}
					if (flag == 0) {
						$button.parent().find( ".input-person-minus" ).attr( 'disabled', false );
						$button.parent().find( ".input-person-minus" ).css( 'opacity', 1 );
						$button.parent().find( "input.input-person" ).val( newVal ).change();
					}
				}
			}
		);

		// Email input field for add-booking guest user
		jQuery( '.ph_guest_email_id_panel' ).hide();

		jQuery( "#ph_add_booking_send_payment_email" ).click(
			function () {

				if (jQuery( this ).is( ':not(:checked)' )) {

					jQuery( '.ph_guest_email_id_panel' ).hide();
				} else {

					jQuery( '.ph_guest_email_id_panel' ).show();
				}
			}
		);

	}
);

/***********************************************************************
 * *** ALL CALLENDER PAGE (date picker, time ticker and month picker) ****
 ************************************************************************/

function calculate_price() {
	jQuery( ".single_add_to_cart_button" ).addClass( "disabled" );
	date_from = jQuery( ".ph-date-from" ).val();
	if ( ! date_from) {
		date_from = jQuery( ".selected-date" ).first().find( ".callender-full-date" ).val();
	}
	if ( ! date_from) {
		return;
	}
	if (jQuery( ".selected-date" ).length == 0) {
		jQuery( ".booking-info-wraper" ).html( '<p id="booking_info_text"  style="text-align:center;">Oops! Something went wrong.Try again</p>' );
		// jQuery(".ph-date-from").val(date_from);
		return;
	}
	date_to = jQuery( ".selected-date" ).last().find( ".callender-full-date" ).val();

	// If charge_per_night, need to pick To date
	if (date_from == date_to && jQuery( '#calender_type' ).val() == 'date' && jQuery( "#book_interval_type" ).val() != 'fixed' && jQuery( '#charge_per_night' ).length && jQuery( '#charge_per_night' ).val() == 'yes') {
		jQuery( ".booking-info-wraper" ).html( '<p id="booking_info_text"  style="text-align:center;">' + phive_booking_locale.pick_an_end_date + '</p>' );
		jQuery( ".ph-date-from" ).val( date_from );
		return;
	}
	jQuery( ".ph-date-from" ).val( date_from );
	jQuery( ".ph-date-to" ).val( date_to ).change(); // trigger .ph-date-to for update the price
}

jQuery( document ).ready(
	function ($) {
		// override_deactive_by_charge_by_night();
		var full_month           = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var date_from            = '';
		var date_to              = '';
		var click                = 0;
		var reched_to            = false;
		var reached_to_flag      = 0;
		var second_selected_date = '';
		var next_time_source     = 'manual';
		block_unavailable_dates();
		function block_unavailable_dates() {
			if (jQuery( '#calender_type' ).val() == 'time') {
				product_id = jQuery( "#phive_product_id" ).val();
				start_date = jQuery( ".callender-full-date" ).first().val();
				var data   = {
					action: 'phive_get_blocked_dates',
					product_id: product_id,
					start_date: start_date,
					asset: $( ".input-assets" ).val(),
				};
				$( ".ph-calendar-overlay" ).show();
				$.post(
					phive_booking_ajax.ajaxurl,
					data,
					function (res) {
						// console.log('success');
						result = jQuery.parseJSON( res );
						$.each(
							result,
							function (key, value) {
								first_el = $( "input[value='" + value + "']" ).closest( "li.ph-calendar-date" );
								first_el.addClass( 'de-active' );
								first_el.addClass( 'not-available' );
							}
						);
						$( ".ph-calendar-overlay" ).hide();
					}
				).fail(
					function () {
						// console.log('failed');
						$( ".ph-calendar-overlay" ).hide();
					}
				);
			}
		}

		$( document ).on(
			"change",
			".resources_check",
			function () {
				val = $( this ).is( ":checked" ) ? 'yes' : 'no';
				$( this ).closest( "div" ).find( ".phive_book_resources" ).val( val );
			}
		)

		$( document ).on(
			"change",
			".input-person",
			function (e) {
				if ($( this ).hasClass( 'input-disabled' )) {
					e.preventDefault();

					$( this ).val( $( this ).attr( "last-val" ) ); // Forcefully taking previous value. preventDefault() is not preventing the changes.
					return;
				}

				$( this ).attr( "last-val", $( this ).val() );

				return;
			}
		);

		$( document ).on(
			"change",
			".input-person",
			function () {
				$( '.participant_count_error' ).html( '' );
				if (parseInt( $( this ).val() ) > parseInt( $( this ).attr( "max" ) )) {
					$( this ).val( $( this ).attr( "max" ) );
					ref_this    = '.participant_count_error_' + $( this ).attr( 'rule-key' );
					var message = phive_booking_locale.max_individual_participant;

					pname   = $( this ).attr( 'data-name' );
					pmax    = parseInt( $( this ).attr( "max" ) );
					message = message.replace( '%pname', pname );
					message = message.replace( '%pmax', pmax );
					$( ref_this ).html( message );

					$( ref_this ).fadeIn(
						'fast',
						function () {
							$( ref_this ).delay( 5000 ).fadeOut();
						}
					);
					return;
				} else if (parseInt( $( this ).val() ) < parseInt( $( this ).attr( "min" ) )) {
					$( this ).val( $( this ).attr( "min" ) );
					ref_this    = '.participant_count_error_' + $( this ).attr( 'rule-key' );
					let message = phive_booking_locale.single_min_participant_warning;

					message = message.replace( '%pname', $( this ).attr( 'data-name' ) );
					message = message.replace( '%min', parseInt( $( this ).attr( "min" ) ) );
					$( ref_this ).html( message );
					$( ref_this ).fadeIn(
						'fast',
						function () {
							$( ref_this ).delay( 5000 ).fadeOut();
						}
					);
					return;
				}
			}
		);

		$( document ).on(
			'change',
			".shipping-price-related",
			function (e) {
				e.stopImmediatePropagation();
				if ($( this ).hasClass( 'input-disabled' )) {
					e.preventDefault();
					return;
				}

				// to check if minimum number of slots are clicked
				if ($( '.selected-date' ).length > 0) {
					// console.log('sel');
					var min_allowed_booking = $( "#book_min_allowed_slot" ).val();
					if ((min_allowed_booking) && ($( "#book_interval_type" ).val() == 'customer_choosen') &&
					($( '#auto_select_min_block' ).length && $( '#auto_select_min_block' ).val() != 'yes') ) {
						min_allowed_booking = parseInt( min_allowed_booking );
						if (min_allowed_booking == 1) {
							calculate_price();
						} else if (($( '.across_the_day_booking' ).length && $( '.across_the_day_booking' ).val() != 'yes')) {
							selected_blocks = parseInt( jQuery( ".selected-date" ).length );
							book_interval   = parseInt( jQuery( "#book_interval" ).val() );
							selected_blocks = selected_blocks / book_interval;
							// console.log('selected_blocks', selected_blocks);
							if ( selected_blocks >= min_allowed_booking ) {
								calculate_price();
							}
						} else {
							phive_book_to_date = $( 'input[name=phive_book_to_date]' ).val();
							if (phive_book_to_date) {
								calculate_price();
							}
						}
					} else {
						calculate_price();
					}
				}
			}
		)

		// placed this code after date click functions after ajax compatibility code change

		// $(document).on("click", ".non-bookable-slot", function () {
		// if ($(this).hasClass('de-active')) {
		// loop_elm = $(this)
		// } else {
		// loop_elm = $(this).nextAll(".de-active:first");
		// }
		// show_not_bookable_message(loop_elm);
		// })

		function get_formated_date(date) {

			date_obj = new Date( date );

			return { "date": date_obj.getUTCDate(), "month": phive_booking_locale.months[date_obj.getUTCMonth()], "year": date_obj.getUTCFullYear(), };
		}

		function show_not_bookable_message(loop_elm) {
			if (loop_elm.length == 0) { // case of last item or no de-active after curent elm.
				return;
			}

			from_text = $( loop_elm ).text();

			msg_html = "";

			// 189607 -Calendar design 3:to_text is undefined
			to_text       = '';
			min_booking   = $( "#book_min_allowed_slot" ).val();
			book_interval = parseInt( $( "#book_interval" ).val() );

			min_limit  = min_booking > 0 ? book_interval * min_booking : book_interval;
			min_limit -= $( '.selected-date' ).length; // Substract aleready selected dates

			while ((loop_elm.length > 0) && (min_limit > 0)) {

				min_limit--;
				to_text = $( loop_elm ).text();
				if (msg_html.length > 0) {
					msg_html  = msg_html.replace( phive_booking_locale.and_text, ", " );
					msg_html += " " + phive_booking_locale.and_text + " <b>" + to_text + "</b>";
				} else {
					msg_html = "<b>" + to_text + "</b>";
				}

				loop_elm = min_limit > 0 ? loop_elm.next( ".de-active" ) : false;
			}
			msg_html += (from_text == to_text) ? " " + phive_booking_locale.is_not_avail : " " + phive_booking_locale.are_not_avail;
			$( '.booking-info-wraper' ).html( '<p id="booking_info_text"><span class="not-available-msg">' + msg_html + '</span></p>' );
		}

		$.fn.isAfter  = function (sel) {
			return this.prevAll( sel ).length !== 0;
		}
		$.fn.isBefore = function (sel) {
			return this.nextAll( sel ).length !== 0;
		}
		$( '.reset_action' ).change(
			function () {
				resetSelection();
			}
		);
		function resetSelection(fullReset) {
			fullReset                        = fullReset || 'yes';
			$date_from_previous_value        = date_from;
			date_from                        = '';
			date_to                          = '';
			click                            = 0;
			unavailable_date_after_from_date = false;
			charge_per_night_overrided       = false;

			$( ".single_add_to_cart_button" ).addClass( "disabled" );
			$( ".selected-date" ).each(
				function () {
					$( this ).removeClass( "selected-date" );
				}
			);
			$( ".timepicker-selected-date" ).each(
				function () {
					last_sel_date = $( ".timepicker-selected-date" ).last().find( '.callender-full-date' ).val();
					current_date  = $( this ).last().find( '.callender-full-date' ).val();
					if (last_sel_date != current_date) {
						$( this ).removeClass( "timepicker-selected-date" );
					}
				}
			);
			$ph_date_from_previous_value = $( ".ph-date-from" ).val();
			$( ".ph-date-from" ).val( "" );
			$( ".ph-date-to" ).val( "" );
			$( '.element_from' ).val( "" );
			$( '.element_to' ).val( "" );
			$( '#ph_selected_blocks' ).val( '' );

			// $('.element_from_date').val("");
			// $('.element_from_time').val("");
			// $('.element_to_date').val("");
			// $('.element_to_time').val("");
			if (fullReset == 'yes') {
				var previous_info_message = $( ".booking-info-wraper" ).html();
				$( ".booking-info-wraper" ).html( "" );
				if (jQuery( '#calender_type' ).val() == 'month') {
					display_text = phive_booking_locale.pick_a_month;
				} else {
					display_text = phive_booking_locale.Please_Pick_a_Date;
				}
				html_text = '<p id="booking_info_text" style="text-align:center;">' + display_text + '</p>';
				if ( ! jQuery( '.timepicker-selected-date' ).length) {
					$( ".booking-info-wraper" ).html( html_text );
					$( ".ph-ul-time" ).hide();
				} else {
					$( ".booking-info-wraper" ).html( previous_info_message );
				}
			}

			if ($( ".not-startable" ).length) {
				$( ".not-startable" ).removeClass( "hide-not-startable" );
			}

			$( ".ph-calendar-days li" ).removeClass( 'can-be-checkout-date' );
			$( "#ph_prev_day_times" ).val( '' );
		}

		function resetHover() {
			$( ".hover-date" ).each(
				function () {
					$( this ).removeClass( "hover-date" );
				}
			);
		}
		function resetCalender() {
			if (($( '.book_interval_period' ).val() == 'minute' || $( '.book_interval_period' ).val() == 'hour')) {
				from         = new Date( $( '.ph-date-from' ).val() );
				current_date = new Date( $( '.timepicker-selected-date' ).find( '.callender-full-date' ).val() );
				// if(from!=current_date)
				// {

				$( '.timepicker-selected-date' ).click();
				// setTimeout(function(){
				// }, 1000);
				// }

			}
		}
		function get_minimum_booking() {
			min_allowed = $( "#book_min_allowed_slot" ).val();
			max_booking = $( "#book_max_allowed_slot" ).val();

			min_allowed = min_allowed.length ? parseInt( min_allowed ) : 1;
			min_booking = min_allowed > 1 ? min_allowed + parseInt( $( "#book_interval" ).val() ) : parseInt( $( "#book_interval" ).val() );
			if (max_booking.length && min_booking > max_booking) {
				min_booking = max_booking;
			}
			return min_booking;
		}

		/**
		 * Make selection to given range
		 * param from: obj, Starting element
		 * param to: obj, Ending lelement
		 */
		function makeSelection(from, to, prev_days_booking_count) {
			var from_date_value = $( from ).find( ".callender-full-date" ).val();
			book_interval       = parseInt( $( "#book_interval" ).val() );    // integer, booking interval period.
			min_limit           = $( "#book_min_allowed_slot" ).val();
			calender_type       = jQuery( '#calender_type' ).val();

			if ($( "#book_interval_type" ).val() == 'customer_choosen' && ((jQuery( '#auto_select_min_block' ).length && jQuery( '#auto_select_min_block' ).val() != 'yes') || $( '#calendar_design' ).val() == '3')) {
				min_limit = '';
			}
			// alert(min_limit);
			max_limit          = $( "#book_max_allowed_slot" ).val();
			booking_start_date = new Date( date_from );
			booking_end_date   = $( to ).find( ".callender-full-date" ).val();
			booking_end_date   = new Date( booking_end_date );
			if ($( '#calendar_design' ).val() == '3' && from_date_value && booking_end_date) {
				if (new Date( from_date_value ) > booking_end_date) {
					// Check whether selected TO value is before the FROM value -- Only done for design 3 now
					$( '.booking-info-wraper' ).html( '<p id="booking_info_text"><span class="not-available-msg">' + phive_booking_locale.pick_later_time + '</span></p>' );
					resetSelection();
					return;
				}
			}
			// min_booking  = get_minimum_booking();

			min_limit = min_limit || 1;
			max_limit = max_limit || 0;
			className = 'selected-date';

			if (book_interval > 1) {
				min_limit = min_limit * book_interval;
				max_limit = max_limit * book_interval;
			}

			min_limit = min_limit > 0 ? round_to_next_stop( min_limit, book_interval ) : 0;
			max_limit = max_limit > 0 ? round_to_next_stop( max_limit, book_interval ) : 0;
			var i     = 1 + prev_days_booking_count;

			elem      = from;
			reched_to = false;
			while (elem && i < 1500) {
				if (elem.length == 0) {
					i = 1500;
					continue;
				}
				if (elem.find( 'span' ).length == 0 && calender_type != 'month') {
					elem = elem.next();
					continue;
				}
				if (to != '' && elem.get( 0 ) == to) {
					reched_to = true;
				}
				if (booking_start_date.getMonth() != booking_end_date.getMonth() && ($( '#calender_type' ).val() != 'time' && $( '#calender_type' ).val() != 'month') && $( "#charge_per_night" ).val() != 'yes') {
					final_date = $( elem ).find( ".callender-full-date" ).val();
					if ( ! is_reached_time_period( final_date )) {
						elem = false;
						continue;
					}
				}
				if (elem.hasClass( "de-active" ) && ! is_overridable_by_charge_per_night( elem )) {

					show_not_bookable_message( elem );
					resetSelection( 'no' );
					return false;
				} else if (max_limit > 0 && i >= (max_limit + 1)) {
					// console.log("max_limit");
					// select_date( elem );
					resetSelection();
					msg_html = phive_booking_locale.max_limit_text;
					msg_html = msg_html.replace( '%max_block', max_limit );
					$( '.booking-info-wraper' ).html( '<p id="booking_info_text"><span class="not-available-msg">' + msg_html + '</span></p>' );
					// setTimeout(function(){
					// resetCalender();
					// }, 2000);
					return false;
					// elem = false;
				}
				// Case of first click
				else if (to == '' && i >= min_limit) {
					// console.log("min_limit");
					if (i == min_limit && from.hasClass( "not-startable" )) {
						resetSelection();
						return false;
					} else {
						select_date( elem );

						// Override not-startable CSS to allow pick TO date
						$( ".not-startable" ).each(
							function () {
								$( this ).addClass( 'hide-not-startable' );
							}
						)
						elem = false;
					}
				}
				// Need to complite an interval.
				else if (reched_to && round_to_next_stop( i, book_interval ) == i) {
					if (booking_start_date.getMonth() != booking_end_date.getMonth() && ($( '#calender_type' ).val() != 'time' && $( '#calender_type' ).val() != 'month')) {
						final_date = $( elem ).find( ".callender-full-date" ).val();

						if ((booking_end_date.getMonth()) || (booking_end_date.getMonth() == 0)) {
							var Difference_In_Time = booking_end_date.getTime() - booking_start_date.getTime();
							// To calculate the no. of days between two dates
							var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
							i                      = Difference_In_Days;
						}

						if ( ! is_reached_time_period( final_date )) {
							elem = false;
						} else {
							select_date( elem );
							if ($( elem ).hasClass( 'de-active' ) && is_overridable_by_charge_per_night( $( elem ) )) {
								elem = false;
							} else {
								// ticket 130688 --Not Allow to select next block when book from one month to next month
								difference_from_to_curr = (new Date( final_date ).getTime() - booking_start_date.getTime()) / (1000 * 3600 * 24);
								block_count             = Math.ceil( difference_from_to_curr / book_interval );
								difference_from_to_curr = difference_from_to_curr + block_count;
								if ( $( "#charge_per_night" ).val() == 'yes' && (difference_from_to_curr) % book_interval == 0) {
									elem = false;
								} else {
									elem = elem.next();
								}
							}
						}
					} else {
						select_date( elem );
						elem = false;

					}

				} else {
					if (booking_start_date.getMonth() != booking_end_date.getMonth() && ($( '#calender_type' ).val() != 'time' && $( '#calender_type' ).val() != 'month')) {
						final_date = $( elem ).find( ".callender-full-date" ).val();

						if ((booking_end_date.getMonth()) || (booking_end_date.getMonth() == 0)) {
							var Difference_In_Time = booking_end_date.getTime() - booking_start_date.getTime();
							// To calculate the no. of days between two dates
							var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
							i                      = Difference_In_Days;
						}

						if ( ! is_reached_time_period( final_date )) {
							elem = false;
						} else {
							select_date( elem );
							// ticket 130688 --Not Allow to select next block when book from one month to next month
							difference_from_to_curr = (new Date( final_date ).getTime() - booking_start_date.getTime()) / (1000 * 3600 * 24);
							block_count             = Math.ceil( (difference_from_to_curr) / book_interval );
							difference_from_to_curr = difference_from_to_curr + block_count;
							if ($( "#charge_per_night" ).val() == 'yes' && reched_to && (difference_from_to_curr) % book_interval == 0 ) {
								elem = false;
							} else {
								elem = elem.next();
							}
						}
					} else {
						select_date( elem );
						elem = elem.next();
					}
				}
				i++;
			}

			if ( ! validate_charge_by_night_selections()) {
				return false;
			}

			return true;
		}

		function select_date(elem, className) {
			className = className || 'selected-date';
			if ( ! elem.hasClass( "de-active" ) || is_overridable_by_charge_per_night( elem )) {
				elem.addClass( className );
				return true;
			}
			return false;
		}
		function is_reached_time_period(to) {
			if (reched_to == true) {
				interval = parseInt( $( "#book_interval" ).val() );

				if (second_selected_date == '') {
					second_selected_date = to;
				}
				start_date     = new Date( date_from );
				end_date       = new Date( to );
				last_date      = new Date( second_selected_date );
				end_date_limit = last_date;
				end_date_limit.setDate( last_date.getDate() + interval );
				iterartion = 0;
				while (start_date <= end_date_limit) {
					if (iterartion == 1 && $( "#charge_per_night" ).val() == 'yes' && interval != 1) {
						interval--;
					}
					start_date.setDate( start_date.getDate() + interval );
					iterartion++;
				}
				start_date.setDate( start_date.getDate() - interval );
				if (end_date < start_date) {
					return true;
				} else {
					return false;
				}
			}
			return true;
		}
		// check if any de-active date coming in between selected (Case of Charge by night enabled)
		function validate_charge_by_night_selections() {
			if ($( '#calender_type' ).val() == 'date' && $( "#book_interval_type" ).val() != 'fixed' && $( '#charge_per_night' ).length && $( '#charge_per_night' ).val() == 'yes') {
				$( ".de-active" ).each(
					function () {
						next_item = $( this ).next( '.selected-date' );
						// If next item is selected-date and it is not fist selected-date
						if (next_item.length && ! $( ".selected-date" ).first().is( next_item )) {
							resetSelection();
							return false;
						}
					}
				);
			}
			return true;
		}

		/* Complite an interval */
		function round_to_next_stop(number, divisor) {

			// To Handle Per Night Charge
			var second_time_selection_with_per_night = false;
			if ($( "#charge_per_night" ).val() == 'yes' && jQuery( "input[name=phive_book_from_date]" ).val().length != 0 && parseInt( jQuery( ".book_interval" ).val() ) > 0) {
				second_time_selection_with_per_night = true;
			}

			if (number > 0) {
				var result = Math.ceil( number / divisor ) * divisor;

				// Handle Enable Per night case for round off for second time selection
				if (second_time_selection_with_per_night) {
					var count = 1;  // 1 if the Bookings start in same month and end in same month, else 0
					// To Handle the Bookings which start in one month and end in next month
					var elem = jQuery( "ul.ph-calendar-days li.ph-calendar-date:nth-child(8)" ).get( 0 )
					if (jQuery( "input[name=phive_book_from_date]" ).val() != undefined && jQuery( elem ).find( 'input[class=callender-full-date]' ).val() != undefined) {
						var start_date   = new Date( jQuery( "input[name=phive_book_from_date]" ).val() );
						var current_date = new Date( jQuery( elem ).find( 'input[class=callender-full-date]' ).val() );
						if (current_date.getUTCMonth() > start_date.getUTCMonth() || current_date.getUTCFullYear() > start_date.getUTCFullYear()) {
							count = 0;
						}
					}
					if (((divisor - 1) * Math.floor( number / (divisor - 1) ) + count) == number) {
						result = number;
					}
				}
				return result;
			} else if (number < 0) {
				return Math.floor( number / divisor ) * divisor;
			} else {
				return divisor;
			}
		}

		function override_deactive_by_charge_by_night() {
			if ($( '#calender_type' ).val() == 'date' && $( "#book_interval_type" ).val() != 'fixed' && $( '#charge_per_night' ).length && $( '#charge_per_night' ).val() == 'yes') {
				$( ".de-active" ).each(
					function () {
						next = $( this ).next( '.ph-calendar-date' );
						if ( ! next.hasClass( "booking-full" ) && ! next.hasClass( "booking-disabled" ) && ! next.hasClass( "de-active" )) {
							// $(this).removeClass('booking-full');
							// $(this).removeClass('booking-disabled');
							// $(this).removeClass('de-active');
						}
					}
				)
			}
		}

		function is_overridable_by_charge_per_night(el) {

			if ($( '#calender_type' ).val() == 'date' && $( "#book_interval_type" ).val() != 'fixed' && $( '#charge_per_night' ).length && $( '#charge_per_night' ).val() == 'yes' ) {
				prev = el.prev( '.ph-calendar-date' );
				if ( ! prev.hasClass( "booking-full" ) && ! prev.hasClass( "booking-disabled" ) && ! prev.hasClass( "de-active" )) {
					// Override only for TO date
					if (($( ".selected-date" ).length ) || (jQuery( '.ph-date-from' ).val() != '')) {
						charge_per_night_overrided = true;
						return true;
					}
				} else if (prev.hasClass( "booking-disabled" ) && prev.hasClass( "ph-next-month-date" ) && ! prev.hasClass( "de-active" ) && ! prev.hasClass( "booking-full" )) {		// 161788
					// Override only for TO date
					if (($( ".selected-date" ).length ) || (jQuery( '.ph-date-from' ).val() != '')) {
						charge_per_night_overrided = true;
						return true;
					}
				}
			}
			return false;
		}

		function enhance_values_for_design_3() {
			if ($is_booking_end_date_clicked) {
				click = 1;
				// The previous selection was invalid, hence, restore the value of date_from
				date_from = date_from ? date_from : $date_from_previous_value;
			} else if ($is_booking_end_time_clicked) {
				if ($( '.ph-date-from' ).val() == '') {
					// End Time was opened when previous selection was invalid
					date_from = date_from ? date_from : $date_from_previous_value;
					$( '.ph-date-from' ).val( $ph_date_from_previous_value );
				}
				click = 2;
			} else if ($is_booking_from_time_clicked) {
				$is_booking_from_time_clicked = false;
				click                         = 2;
			}
			$is_booking_end_date_clicked = false;
		}

		// Picking a date/time/month from calendar.
		// $('.month-picker-wraper,.date-picker-wraper,.time-picker-wraper #ph-calendar-time').on("click", ".ph-calendar-date", function(){
		$( document ).on(
			"click",
			'.month-picker-wraper .ph-calendar-date,.date-picker-wraper .ph-calendar-date,.time-picker-wraper .ph-ul-time .ph-calendar-date',
			function () {
				enhance_values_for_design_3();
				$( ".callender-error-msg" ).html( "&nbsp;" );

				second_selected_date = '';
				// if click on already booked or past date
				if ( ! is_overridable_by_charge_per_night( $( this ) ) && ($( this ).hasClass( "booking-full" ) || $( this ).hasClass( "booking-disabled" ) || $( this ).hasClass( "de-active" ))) {
					if (jQuery( '#calender_type' ).val() == 'date' || jQuery( '#calender_type' ).val() == 'month') {
						$( '#please_pick_a_date_text' ).show();
					}
					$is_booking_from_time_clicked = false;
					return;
				}

				// 194948:- Reset the selection if any unaivalable date after booked-from-date in previous month
				if (unavailable_date_after_from_date == true) {
					resetSelection();
				}

				// if Fixed range, don't allow to choose second date
				if ($( "#book_interval_type" ).val() == 'fixed') {
					if ($( this ).hasClass( 'not-startable' )) {
						return;
					}
					resetSelection();
					$( ".single_add_to_cart_button" ).removeClass( "disabled" );
					$( this ).addClass( "selected-date" );

					book_to = $( this );
					for (var i = parseInt( $( "#book_interval" ).val() ); i > 1; i--) {
						book_to = book_to.next().addClass( "selected-date" );
						if (book_to.hasClass( 'de-active' ) && ! is_overridable_by_charge_per_night( book_to )) {
							resetSelection();
							return;
						}
					};

					if ( ! validate_charge_by_night_selections()) {
						return false;
					}

					if ($( '#calendar_design' ).val() == '3') {
						if (jQuery( '#calender_type' ).val() == 'date') {
							from_date = convert_date_to_wp_format( $( this ).find( ".callender-full-date" ).val(), '' );
							$( '.element_from' ).val( from_date );
						} else if (jQuery( '#calender_type' ).val() == 'month') {

							from_month = convert_month_to_wp_format( $( this ).find( ".callender-full-date" ).val() );
							$( '.element_from' ).val( from_month );
						} else {
							date_time = $( this ).find( ".callender-full-date" ).val();
							// var [date,time] = date_time.split(' ');
							var date = date_time.split( ' ' )[0];
							var time = date_time.split( ' ' )[1];
							time     = convert_time_to_wp_format( date_time, '' );
							$( '.element_from_time' ).val( time );
							$( '.ph-calendar-container' ).hide();
							$( '.please_pick_a_date_text' ).hide();
							$( '.time-calendar-date-section' ).show();
							$( '.ph-calendar-container .time-picker' ).hide();
						}

						$( '.ph-calendar-container' ).hide();
					}

					calculate_price();
					if (jQuery( '#calender_type' ).val() == 'date' || jQuery( '#calender_type' ).val() == 'month') {
						$( '#please_pick_a_date_text' ).hide();
					}
					return;
				} else if ($( "#book_interval_type" ).val() == 'customer_choosen') {
					click++;
					if ($( '#calendar_design' ).val() == '3') {
						if (click % 2 == 1) {
							if ($( this ).hasClass( 'not-startable' )) {
								resetSelection();
								return;
							}
							// console.log('jQuery().val(): ', jQuery('#calender_type').val());
							if (jQuery( '#calender_type' ).val() == 'date') {
								from_date = convert_date_to_wp_format( $( this ).find( ".callender-full-date" ).val(), '' );
								// $('.element_to').val(from_date);
								$( '.element_from' ).val( from_date );
								$( '.element_to' ).val( '' );
								$( '.element_to' ).trigger( 'click' );
								$( '.element_to' ).focus();
							} else if (jQuery( '#calender_type' ).val() == 'month') {
								from_month = convert_month_to_wp_format( $( this ).find( ".callender-full-date" ).val() );
								$( '.element_from' ).val( from_month );
								$( '.element_to' ).val( '' );
								$( '.element_to' ).trigger( 'click' );
								$( '.element_to' ).focus();
							} else {
								date_time = $( this ).find( ".callender-full-date" ).val();

								if ($is_booking_end_time_clicked) {
									// Customer has selected To Time --- And all fields are filled
									$( ".selected-date" ).each(
										function () {
											$( this ).removeClass( "selected-date" );
										}
									);
									book_interval = jQuery( ".book_interval" ).val();
									var date      = date_time.split( ' ' )[0];
									var time      = convert_time_to_wp_format( date_time, parseInt( book_interval ) );
									var to_date   = convert_date_to_wp_format( date, '' );
									$( '.element_to_date' ).val( to_date );
									$( '.element_to_time' ).val( time );
									// $('.element_to_date').trigger('click');
									$( '.time-calendar-date-section' ).hide();
									$( '.ph-calendar-container .time-picker' ).hide();
									click = 0;

								} else {
									// var [date,time] = date_time.split(' ');
									var date = date_time.split( ' ' )[0];
									var time = date_time.split( ' ' )[1];
									// to_date = convert_date_to_wp_format($(this).find(".callender-full-date").val(), '');

									from_date = convert_date_to_wp_format( date, '' );
									if ( ! $is_booking_from_time_clicked) {
										$( '.element_from_date' ).val( from_date );
									}
									time = convert_time_to_wp_format( date_time, '' );

									// 125852 - when across day booking is not checked, start time was not correct in case of timezone conversion
									if ($( '.across_the_day_booking' ).val() == 'no' && $( '.ph_time_zone_conversion_active' ).val() == 'yes') {
										time = $( this ).find( ".ph_calendar_time_start" ).text();
									}

									$( '.element_from_time' ).val( time );
									var across_the_day_booking = jQuery( '.across_the_day_booking' ).val();
									$( '.element_to_date' ).val( '' );
									$( '.element_to_time' ).val( '' );

									if (across_the_day_booking == 'no') {

										$( '.element_to_date' ).val( from_date );
										$( '.element_to_time' ).val( '' );
										$( '.element_to_time' ).trigger( 'click' );
										$( '.element_to_time' ).focus();
										$( '.time-calendar-date-section' ).hide();
										$( '.ph-calendar-container .time-picker' ).show();
									} else {
										if ($( '.element_from_date' ).val() == $( '.element_to_date' ).val()) {

											$( '.element_to_time' ).val( '' );
											$( '.element_to_time' ).trigger( 'click' );
											$( '.element_to_time' ).focus();
											$( '.time-calendar-date-section' ).hide();
											$( '.ph-calendar-container .time-picker' ).show();
										} else {

											$( '.element_to_date' ).val( '' );
											$( '.element_to_time' ).val( '' );
											$( '.element_to_date' ).trigger( 'click' );
											$( '.element_to_date' ).focus();
											$( '.time-calendar-date-section' ).show();
											$( '.ph-calendar-container .time-picker' ).hide();
										}
									}

								}

							}

							// alert($(this).find(".callender-full-date").val());

						} else if (click % 2 == 0) {
							if (jQuery( '#calender_type' ).val() == 'date') {
								book_interval = jQuery( ".book_interval" ).val();
								if (parseInt( book_interval ) == 1) {
									to_date = convert_date_to_wp_format( $( this ).find( ".callender-full-date" ).val(), '' );
								} else {
									to_date = convert_date_to_wp_format( $( this ).find( ".callender-full-date" ).val(), parseInt( book_interval ) );
								}

								// to_date
								$( '.element_to' ).val( to_date );
								$( '.ph-calendar-container' ).hide();
								$( '.please_pick_a_date_text' ).hide();
							} else if (jQuery( '#calender_type' ).val() == 'month') {
								to_month = convert_month_to_wp_format( $( this ).find( ".callender-full-date" ).val() );
								$( '.element_to' ).val( to_month );
								$( '.ph-calendar-container' ).hide();
								$( '.please_pick_a_date_text' ).hide();
							} else {
								date_time     = $( this ).find( ".callender-full-date" ).val();
								book_interval = jQuery( ".book_interval" ).val();
								// var [date,time] = date_time.split(' ');
								var date = date_time.split( ' ' )[0];
								var time = date_time.split( ' ' )[1];
								to_date  = convert_date_to_wp_format( date, '' );
								$( '.element_to_date' ).val( to_date );

								time = convert_time_to_wp_format( date_time, parseInt( book_interval ) );
								$( '.element_to_time' ).val( time );

								$( '.ph-calendar-container' ).hide();
								// $('.time-calendar-date-section').show();
								$( '.ph-calendar-container .time-picker' ).hide();
							}

						}
					}

					// Reset all selection on third click
					if ( ! $is_booking_end_time_clicked && click % 3 == 0) {
						resetSelection();

						$( this ).trigger( 'click' );
						// setTimeout(function(){
						// resetCalender();
						// }, 1000);
						return;
					}

					// When selecting the end slot before start slot.
					if ( $( this ).isBefore( ".selected-date" ) ) {

						$is_booking_from_time_clicked = false;
						resetSelection();
						return;
					}

					// if selected a date_to, which is past to date_from
					if (date_from != '' && date_to == '' && $( this ).isBefore( ".selected-date" )) {
						// resetSelection()
						if (jQuery( '#calender_type' ).val() == 'date' || jQuery( '#calender_type' ).val() == 'month') {
							$( '.booking-info-wraper' ).html( '<p id="booking_info_text"><span class="not-available-msg">' + phive_booking_locale.pick_later_date + '</span></p>' );
							// $('#please_pick_a_date_text').show();
							resetSelection();
						} else {
							$( '.booking-info-wraper' ).html( '<p id="booking_info_text"><span class="not-available-msg">' + phive_booking_locale.pick_later_time + '</span></p>' );
							resetSelection();
						}
						$is_booking_from_time_clicked = false;
						return;
					}

					// first_el = $( ".selected-date:first" );

					// if click for FROM date // Odd click
					if ( ! $is_booking_end_time_clicked && ($is_booking_from_time_clicked || date_from == "" || click % 2 != 0 || $( "#book_interval_type" ).val() != 'customer_choosen')) {
						date_from = $( this ).find( ".callender-full-date" ).val();
						$( this ).addClass( "selected-date" );
						handle_min_booking = true;
						slected            = makeSelection( $( this ), '', 0 );

						// Checkout date hovering and display
						first         = $( ".ph-calendar-days .selected-date" ).first();
						first_index   = $( ".ph-calendar-days li" ).index( first );
						current_index = $( ".ph-calendar-days  li" ).index( this );
						added_class   = false;

						next       = $( first ).next();
						next_index = $( ".ph-calendar-days li" ).index( next );

						if ($( next ).hasClass( 'de-active' ) || $( next ).hasClass( 'not-available' )) {
							if (is_overridable_by_charge_per_night( $( next ) )) {
								$( next ).addClass( "can-be-checkout-date" );
								added_class = true;
							}
						}
						if (added_class == false) {
							while (parseInt( next_index ) != -1) {
								next       = $( next ).next();
								next_index = $( ".ph-calendar-days li" ).index( next );
								if ($( next ).hasClass( 'de-active' ) || $( next ).hasClass( 'not-available' )) {
									// console.log(this);
									if (is_overridable_by_charge_per_night( $( next ) )) {
										$( next ).addClass( "can-be-checkout-date" );
										break;
									}
								}
							}
						}
						// Checkout date hovering and display end

						var calendar_type          = jQuery( '#calender_type' ).val();
						var across_the_day_booking = jQuery( '.across_the_day_booking' ).val();
						if (calendar_type == 'time' && across_the_day_booking != 'no') {
							if (jQuery( '#auto_select_min_block' ).val() == 'yes' && $( '#calendar_design' ).val() != '3') {
								handle_min_booking = handle_min_bookings();
							}

						}

						if (slected && (calendar_type == 'date' || calendar_type == 'month')) {
							$( '#please_pick_a_date_text' ).hide();
						}
						if (slected && handle_min_booking) {
							if (((jQuery( '#auto_select_min_block' ).length && jQuery( '#auto_select_min_block' ).val() != 'yes') && jQuery( '#book_min_allowed_slot' ).val() != '' && jQuery( '#book_min_allowed_slot' ).val() != 1 || $( '#calendar_design' ).val() == '3')) {
								date_from = jQuery( ".ph-date-from" ).val();
								if ( ! date_from) {
									date_from = jQuery( ".selected-date" ).first().find( ".callender-full-date" ).val();
								}
								jQuery( ".ph-date-from" ).val( date_from );
								if (jQuery( '#calender_type' ).val() == 'month') {
									jQuery( ".booking-info-wraper" ).html( '<p id="booking_info_text"  style="text-align:center;">' + phive_booking_locale.pick_a_end_month + '</p>' );
								} else if (jQuery( '#calender_type' ).val() == 'time') {
									jQuery( ".booking-info-wraper" ).html( '<p id="booking_info_text"  style="text-align:center;">' + phive_booking_locale.pick_a_end_time + '</p>' );
								} else {
									jQuery( ".booking-info-wraper" ).html( '<p id="booking_info_text"  style="text-align:center;">' + phive_booking_locale.pick_an_end_date + '</p>' );
								}
								// calculate_price();
							} else {
								if (jQuery( '#calender_type' ).val() == 'date' || jQuery( '#calender_type' ).val() == 'month') {
									calculate_price();
								} else {
									slected = check_min_max( slected, 0 );
									if (slected) {
										calculate_price();
									}
								}
								// calculate_price();
							}
						}
					}
					// click for TO date
					else {
						// if ($is_booking_end_time_clicked) {
						// click = 2;
						// }

						$( ".ph-calendar-days li" ).removeClass( 'can-be-checkout-date' );	// Checkout date hovering and display

						$is_booking_end_time_clicked    = false;
						first_el                        = $( "input[value='" + date_from + "']" ).closest( "li.ph-calendar-date" );
						var booked_no_of_interval_count = 0;
						if ( ! first_el.length) {
							first_el = $( "li.ph-calendar-date" ).first();
							// alert(start_date_and_time);
							if ($( '#calender_type' ).val() == 'time') {
								// var start_date_and_time = jQuery("#ph-calendar-time .callender-full-date").val();
								var start_date_and_time = jQuery( ".ph-ul-time .callender-full-date" ).val();
								if (typeof start_date_and_time != 'undefined' && start_date_and_time != "") {
									if (date_from.substr( 0, date_from.indexOf( ' ' ) ) != start_date_and_time.substr( 0, start_date_and_time.indexOf( ' ' ) )) {
										booked_no_of_interval_count = ph_booked_no_of_interval_count();
										first_el                    = $( "input[value='" + start_date_and_time + "']" ).closest( "li" );
									}
								}
							} else if ($( '#calender_type' ).val() == 'date') {
								i = 0;
								while (first_el && i < 30) {
									if (first_el.find( 'span' ).length == 0) {
										first_el = first_el.next();
										continue;
									}
									break;
									i++;
								}

								// var start_date_and_time = jQuery("#ph-calendar-days .callender-full-date").val();
								var start_date_and_time = jQuery( ".ph-ul-date .callender-full-date" ).val();
								// alert(start_date_and_time);
								if (typeof start_date_and_time != 'undefined' && start_date_and_time != "") {
									if (date_from != start_date_and_time) {
										booked_no_of_interval_count = ph_booked_no_of_interval_count_days();
										first_el                    = $( "input[value='" + start_date_and_time + "']" ).closest( "li" );
									}
								}
							}
						}
						slected = makeSelection( first_el, this, booked_no_of_interval_count );
						// if ((jQuery('#auto_select_min_block').length && jQuery('#auto_select_min_block').val() != 'yes') || $('#calendar_design').val() == '3') {
						// should be called all the time when two date is clicked
						slected = check_min_max( slected, booked_no_of_interval_count );
						// }
						if (slected) {
							calculate_price();
						} else {
							if (jQuery( '#calender_type' ).val() == 'date' || jQuery( '#calender_type' ).val() == 'month') {
								$( '#please_pick_a_date_text' ).show();
							}
						}
					}
				}
				$is_booking_from_time_clicked = false;

			}
		);

		$( document ).on(
			"click",
			".non-bookable-slot",
			function () {
				if ($( this ).hasClass( 'de-active' )) {
					loop_elm = $( this )
				} else {
					loop_elm = $( this ).nextAll( ".de-active:first" );
				}
				show_not_bookable_message( loop_elm );
			}
		)

		function check_min_max(return_value, booked_no_of_interval_count) {
			jQuery( ".single_add_to_cart_button" ).addClass( "disabled" );
			date_from = jQuery( ".ph-date-from" ).val();

			if ( ! date_from) {
				date_from = jQuery( ".selected-date" ).first().find( ".callender-full-date" ).val();
			}
			if ( ! date_from) {
				return return_value;
			}

			date_to = jQuery( ".selected-date" ).last().find( ".callender-full-date" ).val();
			if (date_from && date_to) {
				if (new Date( date_from ) > new Date( date_to )) {
					// Check whether selected TO value is before the FROM value
					$( '.booking-info-wraper' ).html( '<p id="booking_info_text"><span class="not-available-msg">' + phive_booking_locale.pick_later_time + '</span></p>' );
					return false;
				}
			}

			if (jQuery( "#book_interval_type" ).val() != 'fixed') {
				book_interval = parseInt( jQuery( "#book_interval" ).val() );     // integer, booking interval period.
				min_limit     = jQuery( "#book_min_allowed_slot" ).val();
				length        = jQuery( ".selected-date" ).length;
				length        = parseInt( length ) + parseInt( booked_no_of_interval_count ) * parseInt( book_interval );

				// min limit not working with charge per night
				check_min_limit = parseInt( min_limit ) * parseInt( book_interval );
				if ($( "#charge_per_night" ).val() == 'yes') {
					date_from_obj = new Date( date_from );
					// ticket 121165-timezone issue
					date_from_month = date_from_obj.getUTCMonth();
					// console.log("date_from_month : ",date_from_month);

					date_to_obj = new Date( date_to );
					// ticket 121165-timezone issue
					date_to_month = date_to_obj.getUTCMonth();
					// console.log("date_to_month : ",date_to_month);

					if (date_from_month != date_to_month) {
						check_min_limit = (parseInt( min_limit ) * parseInt( book_interval )) - 1;
					}
				}

				if (parseInt( length ) < check_min_limit) {
					if ($( '#calendar_design' ).val() != '3') {
						resetSelection();
					}

					pick_min_date = phive_booking_locale.pick_min_date;
					pick_min_date = pick_min_date.replace( '%d', min_limit );
					jQuery( ".booking-info-wraper" ).html( '<p id="booking_info_text"><span class="not-available-msg">' + pick_min_date + '</span></p>' );
					return false;
				}
			}
			return return_value;
			// jQuery(".ph-date-from").val(date_from);
			// jQuery(".ph-date-to").val( date_to ).change(); //trigger .ph-date-to for update the price
		}
		function ph_booked_no_of_interval_count_days() {

			// ticket 126879 -not allowing to select multiple month if we set minimum duration

			var booking_count          = 0;
			var booking_from_date_time = jQuery( ".ph-date-from" ).val();

			if (typeof booking_from_date_time == 'string') {
				var start_date_obj = new Date( booking_from_date_time );

				booking_ending_date = new Date(	jQuery( ".ph-ul-date .callender-full-date" ).val() );

				// 131294-timezone issue
				if (start_date_obj.getUTCMonth() != booking_ending_date.getUTCMonth() ) {
					var Difference_In_Time = booking_ending_date.getTime() - start_date_obj.getTime();
					// To calculate the no. of days between two dates
					booking_count = Difference_In_Time / (1000 * 3600 * 24);
					booking_count = parseInt( booking_count );
				}
			}
			// alert(booking_count);
			if ($( "#charge_per_night" ).val() == 'yes') {
				booking_count--;
			}
			return booking_count;
		}
		// Handle Minimum Bookings in case of end of the day or month
		function handle_min_bookings() {
			var min_allowed_booking = jQuery( "#book_min_allowed_slot" ).val();
			if (min_allowed_booking <= 1) {
				return true;
			}
			jQuery( ".single_add_to_cart_button" ).addClass( "disabled" );
			date_from = jQuery( ".ph-date-from" ).val();
			if ( ! date_from) {
				date_from = jQuery( ".selected-date" ).first().find( ".callender-full-date" ).val();
				jQuery( ".ph-date-from" ).val( date_from );
			}
			if ( ! date_from) {
				return false;
			}
			date_to = jQuery( ".selected-date" ).last().find( ".callender-full-date" ).val();

			var date_to_obj    = new Date( date_to );
			var calendar_type  = jQuery( '#calender_type' ).val();
			var book_interval  = parseInt( jQuery( ".book_interval" ).val() );
			var end_date_obj   = new Date( date_from );
			var date_to_select = "";
			var status         = true;
			if (calendar_type == 'date') {
				var to_modify = book_interval * min_allowed_booking - 1;
				end_date_obj.setDate( end_date_obj.getDate() + to_modify );
				if (end_date_obj > date_to_obj) {
					status = false;
					jQuery( ".ph-next" ).click()
					setTimeout(
						function () {
							date_to_obj.setDate( 01 );
							while (date_to_obj <= end_date_obj) {
								var year       = date_to_obj.getFullYear();
								var month      = ("0" + (date_to_obj.getMonth() + 1)).slice( -2 );
								var date       = ("0" + date_to_obj.getDate()).slice( -2 );
								date_to_select = year + '-' + month + '-' + date;
								var elem       = jQuery( "input[value=" + date_to_select + "]" ).closest( "li" )
								status         = select_date( elem, "selected-date" );
								if ( ! status) {
									msg_html = elem.find( "span" ).html() + " " + phive_booking_locale.is_not_avail;
									$( '.booking-info-wraper' ).html( '<p id="booking_info_text"><span class="not-available-msg">' + msg_html + '</span></p>' );
									return false;
								}
								date_to_obj.setDate( date_to_obj.getDate() + 1 )
							}
							calculate_price();
						},
						2000
					)
				}
			} else if (calendar_type == 'time') {
				var interval_period = jQuery( ".book_interval_period" ).val();    // hour, day etc
				var to_modify       = book_interval * (min_allowed_booking - 1);
				if (interval_period == "hour") {
					to_modify     = to_modify * 60;
					book_interval = book_interval * 60;
				}
				end_date_obj.setMinutes( end_date_obj.getMinutes() + to_modify );

				if (end_date_obj > date_to_obj) {
					status           = false;
					next_time_source = 'automatic';
					jQuery( ".ph-next-day-time" ).click();
					setTimeout(
						function () {
							while (end_date_obj > date_to_obj) {
								date_to_obj.setMinutes( date_to_obj.getMinutes() + book_interval );
								var year       = date_to_obj.getFullYear();
								var month      = ("0" + (date_to_obj.getMonth() + 1)).slice( -2 );
								var date       = ("0" + date_to_obj.getDate()).slice( -2 );
								var hour       = ("0" + date_to_obj.getHours()).slice( -2 );
								var minute     = ("0" + date_to_obj.getMinutes()).slice( -2 );
								date_to_select = year + '-' + month + '-' + date + ' ' + hour + ':' + minute;
								var elem       = jQuery( "input[value='" + date_to_select + "']" ).closest( "li" )
								status         = select_date( elem, "selected-date" );
								if ( ! status) {
									msg_html = elem.find( "span" ).html() + " " + phive_booking_locale.is_not_avail;
									$( '.booking-info-wraper' ).html( '<p id="booking_info_text"><span class="not-available-msg">' + msg_html + '</span></p>' );
									return false;
								}
							}
							calculate_price();
						},
						2000
					);
				}
			}
			return status;
		}

		function ph_booked_no_of_interval_count() {
			var booking_count          = 0;
			var booking_from_date_time = jQuery( ".ph-date-from" ).val();
			if (typeof booking_from_date_time == 'string') {
				var booking_start_from = booking_from_date_time.split( ' ' )[1];
				var status             = false;

				// 189523   Issue:when Availability rule as no, not able to book across the available times on those days
				var ph_prev_day_times = jQuery( '#ph_prev_day_times' ).val().split( ',' );

				jQuery( ph_prev_day_times ).each(
					function () {
						if (status) {
							booking_count++;
						} else {
							if (this == booking_start_from && ! status) {
								status = true;
								booking_count++;
							}
						}
					}
				)
				var start_date_obj = new Date( booking_from_date_time.split( ' ' )[0] );
				// var end_date_obj  = new Date(jQuery("ul#ph-calendar-time li").last().find('input').val().split(' ')[0]);
				var end_date_obj = new Date( jQuery( "ul.ph-ul-time li" ).last().find( 'input' ).val().split( ' ' )[0] );
				var date_diff    = end_date_obj.getTime() - start_date_obj.getTime();
				if (date_diff != 1) {
					// booking_count = booking_count + ( ( date_diff / (24 * 3600 * 1000) - 1) * jQuery("ul#ph-calendar-time li").length);
					booking_count = booking_count + ((date_diff / (24 * 3600 * 1000) - 1) * jQuery( "ul.ph-ul-time li" ).length);
				}
			}
			// alert(booking_count);
			return booking_count;
		}

		// time picker month calendar

		// $('.time-picker-wraper #ph-calendar-days').on("click", ".ph-calendar-date", function(){
		$( document ).on(
			"click",
			".time-picker-wraper .ph-ul-date .ph-calendar-date",
			function () {
				if ($( this ).hasClass( 'not-startable' ) || $( this ).hasClass( "de-active" )) {
					e.preventDefault();
					return;
				}
				$( '.ph-calendar-date' ).removeClass( "timepicker-selected-date" );

				// 121239 - Issue -  If you select a date&time, then change the date (but user does NOT pick a time) and press book --> The plugin will automatically consider the previous date&time selected and proceed to the check-out.
				if (($( '#book_interval_type' ).val() == 'customer_choosen' || $( '#book_interval_type' ).val() == 'fixed')
				&& ($( '.book_interval_period' ).val() == 'minute' || $( '.book_interval_period' ).val() == 'hour')) {
					resetSelection();
				}

				var all_time_slots = '';

				// 204565,189523   Issue:when Availability rule as no, not able to book across the available times on those days
				jQuery( "ul.ph-ul-time li" ).each(
					function () {
						if (all_time_slots == '') {
							all_time_slots = $( this ).find( 'input' ).val().split( ' ' )[1];
						} else {
							all_time_slots = all_time_slots + "," + $( this ).find( 'input' ).val().split( ' ' )[1];
						}
					}
				);
				jQuery( '#ph_prev_day_times' ).val( all_time_slots );
				var across_the_day_booking = jQuery( '.across_the_day_booking' ).val();
				if (across_the_day_booking == 'no') {
					resetSelection();
				}
				$( this ).addClass( "timepicker-selected-date" );
				return;
			}
		);

		$( document ).on(
			"hover",
			".date-picker-wraper .ph-calendar-date,.time-picker-wraper .ph-calendar-date",
			function (event) {
				if (event.type == "mouseenter") {
					if ($( this ).hasClass( "selected-date" )
					|| $( this ).hasClass( "booking-disabled" )
					|| $( this ).hasClass( "de-active" )) {
						return
					}
					if ($( "#book_interval_type" ).val() == 'fixed') {
						$( this ).addClass( "hover-date" );

						book_to = $( this );
						for (var i = parseInt( $( "#book_interval" ).val() ); i > 1; i--) {
							book_to = book_to.next().addClass( "hover-date" );
							if (book_to.hasClass( 'de-active' )) {
								resetHover();
								return;
							}
						};
					} else {

					}
				} else if (event.type == "mouseleave") {
					resetHover();
				}
			}
		);

		$( document ).on(
			"click",
			".date-picker-wraper .ph-next,.time-picker-wraper .ph-next",
			function () {

				ph_current_month = new Date().toLocaleString( 'en-US', { month: 'long' } );
				ph_current_year  = new Date().getFullYear();

				product_id    = jQuery( "#phive_product_id" ).val();
				month         = jQuery( ".callender-month" ).val();
				year          = jQuery( ".callender-year" ).val();
				calender_type = jQuery( "#calender_type" ).val();
				if (calender_type == 'time') {
					calendar_for   = 'time-picker';
					loding_ico_url = $( "#plugin_dir_url" ).val() + "/resources/icons/loading2.gif";
					// $("#ph-calendar-time").html('<img class="loading-ico" align="middle" src="'+loding_ico_url+'">');
					$( ".ph-ul-time" ).html( '<img class="loading-ico" align="middle" src="' + loding_ico_url + '">' );
				} else if (calender_type == 'date') {
					calendar_for = 'date-picker';
				} else {
					calendar_for = '';
				}
				if ($( "#book_interval_type" ).val() == 'fixed') {
					resetSelection();
				}
				// 129441- allowing the customers to select between months when minimum duration is less than or equal to available blocks
				min_booking   = $( "#book_min_allowed_slot" ).val();
				book_interval = parseInt( $( "#book_interval" ).val() );
				per_night     = $( "#charge_per_night" ).val();

				min_limit = min_booking > 0 ? book_interval * min_booking : book_interval;

				// add selected date
				// Kept the old code to know how we are doing early 214759
				// var min_available = $('.selected-date').nextUntil('.de-active').length+1;
				let min_available = 1;
				if (per_night == 'yes') {
					min_available++;
				}

				// Case of 'To' date on next month, if de-active found after selection need to rest 'From'
				// Kept the old code to know how we are doing early 214759
				// unavailable_date_after_from_date = $('.de-active').last().isAfter('.selected-date');

				// 214759 Looping through every date after the selected date to check if any unavailable date is there
				jQuery( '.selected-date' ).first().nextAll( '.ph-calendar-date' ).each(
					function () {

						min_available++;
						if ($( this ).hasClass( '.de-active' )) {

							unavailable_date_after_from_date = true;
							return false;
						}
						if ($( this ).hasClass( '.ph-next-month-date' )) {

							return false;
						}
					}
				);

				// Reset the selection when there is unavailable date after from-date and to-date not present
				if ( unavailable_date_after_from_date && ( min_available < min_limit || $( '.ph-date-to' ).val() == '' ) ) {
					resetSelection();
				}
				var data = {
					action: 'phive_get_callender_next_month',
					// security : phive_booking_locale.security,
					product_id: product_id,
					month: month,
					year: year,
					calendar_for: calendar_for,
					asset: $( ".input-assets" ).val(),
				};

				// $("#ph-calendar-overlay").show();
				$( ".ph-calendar-overlay" ).show();
				$.post(
					phive_booking_locale.ajaxurl,
					data,
					function (res) {
						// $("#ph-calendar-overlay").hide();
						$( ".ph-calendar-overlay" ).hide();
						if (calender_type == 'time') {
							// $("#ph-calendar-time").html( '<center>'+phive_booking_locale.Please_Pick_a_Date+'</center>');
							// $(".ph-ul-time").html( '<center>'+phive_booking_locale.Please_Pick_a_Date+'</center>');
							$( ".ph-ul-time" ).html( '' );
							$( ".ph-ul-time" ).hide();

							html_text = '<p id="booking_info_text" style="text-align:center;">' + phive_booking_locale.Please_Pick_a_Date + '</p>';
							$( ".booking-info-wraper" ).html( html_text );
						} else if (calender_type == 'date ' && ! $( ".ph-date-from" ).val()) {
							// $('#please_pick_a_date_text').show();

							html_text = '<p id="booking_info_text" style="text-align:center;">' + phive_booking_locale.Please_Pick_a_Date + '</p>';
							$( ".booking-info-wraper" ).html( html_text );
						}
						result = jQuery.parseJSON( res );

						// $("#ph-calendar-days").html(result.days);
						$( ".ph-ul-date" ).html( result.days );

						jQuery( ".callender-month" ).val( result.month ).change()
						jQuery( ".callender-year" ).val( result.year )

						if ( (result.month == ph_current_month) && (result.year == ph_current_year) ) {

							jQuery( ".ph-prev" ).hide();
						} else {

							jQuery( ".ph-prev" ).show();
						}
						// Month text not translatin in arabic language for polylang 192179
						if (result.display_month) {
							jQuery( ".span-month" ).html( result.display_month );
						} else {
							jQuery( ".span-month" ).html( phive_booking_locale.months[full_month.indexOf( result.month )] );
						}
						jQuery( ".span-year" ).html( result.display_year )

						if ( ! $( ".ph-date-from" ).val()) {
							$( ".single_add_to_cart_button" ).addClass( "disabled" );
						}
						block_unavailable_dates();
						// override_deactive_by_charge_by_night();
						if (jQuery( '.ph-date-from' ).val() != '') {
							elem = $( 'li.ph-calendar-date.de-active' ).first();

							// IF charge per night overrided in previous month no need to override again
							if (is_overridable_by_charge_per_night( $( elem ) ) && ! charge_per_night_overrided) {
								$( elem ).addClass( "can-be-checkout-date" );
								// added_class = true;
							}
						}
					}
				);
			}
		)

		$( document ).on(
			"click",
			".date-picker-wraper .ph-prev,.time-picker-wraper .ph-prev",
			function () {

				ph_current_month = new Date().toLocaleString( 'en-US', { month: 'long' } );
				ph_current_year  = new Date().getFullYear();

				resetSelection() // The plugin is not supports to select backward.
				product_id    = jQuery( "#phive_product_id" ).val();
				month         = jQuery( ".callender-month" ).val();
				year          = jQuery( ".callender-year" ).val();
				calender_type = jQuery( "#calender_type" ).val();
				if (calender_type == 'time') {
					calendar_for   = 'time-picker';
					loding_ico_url = $( "#plugin_dir_url" ).val() + "/resources/icons/loading2.gif";
					// $("#ph-calendar-time").html('<img class="loading-ico" align="middle" src="'+loding_ico_url+'">');
					$( ".ph-ul-time" ).html( '<img class="loading-ico" align="middle" src="' + loding_ico_url + '">' );
				} else if (calender_type == 'date') {
					calendar_for = 'date-picker';
				} else {
					calendar_for = '';
				}
				var data = {
					action: 'phive_get_callender_prev_month',
					// security : phive_booking_locale.security,
					product_id: product_id,
					month: month,
					year: year,
					calendar_for: calendar_for,
					asset: $( ".input-assets" ).val(),
				};

				// $("#ph-calendar-overlay").show();
				$( ".ph-calendar-overlay" ).show();

				$.post(
					phive_booking_locale.ajaxurl,
					data,
					function (res) {
						// $("#ph-calendar-overlay").hide();
						$( ".ph-calendar-overlay" ).hide();
						if (calender_type == 'time') {
							// $("#ph-calendar-time").html( '<center>'+phive_booking_locale.Please_Pick_a_Date+'</center>');
							// $(".ph-ul-time").html( '<center>'+phive_booking_locale.Please_Pick_a_Date+'</center>');
							$( ".ph-ul-time" ).html( '' );
							$( ".ph-ul-time" ).hide();

							html_text = '<p id="booking_info_text" style="text-align:center;">' + phive_booking_locale.Please_Pick_a_Date + '</p>';
							$( ".booking-info-wraper" ).html( html_text );
						} else if (calender_type == 'date') {
							// $('#please_pick_a_date_text').show();

							html_text = '<p id="booking_info_text" style="text-align:center;">' + phive_booking_locale.Please_Pick_a_Date + '</p>';
							$( ".booking-info-wraper" ).html( html_text );
						}

						result = jQuery.parseJSON( res );

						// $("#ph-calendar-days").html(result.days);
						$( ".ph-ul-date" ).html( result.days );

						jQuery( ".callender-month" ).val( result.month ).change()
						jQuery( ".callender-year" ).val( result.year )

						if ( (result.month == ph_current_month) && (result.year == ph_current_year) ) {

							jQuery( ".ph-prev" ).hide();
						} else {

							jQuery( ".ph-prev" ).show();
						}

						// Month text not translatin in arabic language for polylang 192179
						if (result.display_month) {
							jQuery( ".span-month" ).html( result.display_month );
						} else {
							jQuery( ".span-month" ).html( phive_booking_locale.months[full_month.indexOf( result.month )] )
						}
						jQuery( ".span-year" ).html( result.display_year )
						block_unavailable_dates();
						// override_deactive_by_charge_by_night();
					}
				);
			}
		)
		function check_not_available_slots() {
			first      = $( '.time-picker .selected-date' );
			next       = $( first ).next();
			next_index = $( ".ph-calendar-days li" ).index( next );
			while (parseInt( next_index ) != -1) {
				if ($( next ).hasClass( 'de-active' ) || $( next ).hasClass( 'not-available' )) {
					show_not_bookable_message( next );
				}
				next       = $( next ).next();
				next_index = $( ".ph-calendar-days li" ).index( next );

			}
			return true;
		}
		/**
		 * For Getting Next Day Time
		 */
		$( document ).on(
			"click",
			".date-picker-wraper .ph-next-day-time,.time-picker-wraper .ph-next-day-time",
			function () {
				// $("#ph-calendar-time #ph-calendar-overlay").show();
				$( ".ph-ul-time" ).show();
				$( ".ph-ul-time .ph-calendar-overlay" ).show();
				var product_id        = jQuery( "#phive_product_id" ).val();
				var date              = jQuery( "#ph-booking-time-for-the-date" ).val();
				var date_obj          = new Date( date );
				var next_day_date_obj = new Date( date_obj.getTime() + 86400000 );

				// The date string must be always with yyyy-mm-dd format
				var next_day_date  = next_day_date_obj.getFullYear() + '-' + ("0" + (next_day_date_obj.getMonth() + 1)).slice( -2 ) + '-' + ("0" + next_day_date_obj.getDate()).slice( -2 );
				var selected_date  = jQuery( '.ph-date-from' ).val();
				var all_time_slots = '';

				// 189523   Issue:when Availability rule as no, not able to book across the available times on those days
				jQuery( "ul.ph-ul-time li" ).each(
					function () {
						if (all_time_slots == '') {
							all_time_slots = $( this ).find( 'input' ).val().split( ' ' )[1];
						} else {
							all_time_slots = all_time_slots + "," + $( this ).find( 'input' ).val().split( ' ' )[1];
						}
					}
				);
				jQuery( '#ph_prev_day_times' ).val( all_time_slots );
				// if(selected_date!='' )
				// {
				// check_not_available_slots();
				// }
				// jQuery('#ph-calendar-days li').each(function(){
				jQuery( '.ph-ul-date li' ).each(
					function () {
						jQuery( this ).removeClass( 'timepicker-selected-date' );
						sel_date       = new Date( jQuery( this ).find( '.callender-full-date' ).val() );
						next_prev_date = new Date( next_day_date );
						first_date     = new Date( selected_date );
						if (parseInt( sel_date.getDate() ) == parseInt( next_prev_date.getDate() ) && parseInt( sel_date.getMonth() ) == parseInt( next_prev_date.getMonth() ) && parseInt( sel_date.getFullYear() ) == parseInt( next_prev_date.getFullYear() )) {
							jQuery( this ).addClass( 'timepicker-selected-date' );
						} else if (selected_date != '') {
							first_date = new Date( selected_date.split( " " )[0] );
							if (first_date <= sel_date && sel_date <= next_prev_date) {
								jQuery( this ).addClass( 'timepicker-selected-date' );
							}
						}

					}
				);
				// check all slots available after selected time in selected date
				if (next_time_source == 'manual') {
					check_blocked_slots_between();  // trigger only when manually moving to next day time slots
				}
				var data = {
					action: 'phive_get_booked_datas_of_date',
					product_id: product_id,
					date: next_day_date,
					type: 'time-picker',
					asset: $( ".input-assets" ).val(),
					selected_date: selected_date,
				};
				jQuery( ".ph-calendar-date" ).prop( 'disabled', true );
				$.post(
					phive_booking_locale.ajaxurl,
					data,
					function (res) {
						jQuery( ".ph-calendar-date" ).prop( 'disabled', false );
						// $("#ph-calendar-time").html(res).trigger('change');
						$( ".ph-ul-time" ).html( res );
						$( "#ph-calendar-time" ).trigger( 'change' );
						$( this ).addClass( "timepicker-selected-date" );
						if (next_time_source == 'manual') {
							check_blocked_slots();  // trigger only when manually moving to next day time slots
						}

					}
				);
			}
		)

		/**
		 * For Getting Previous Day Time
		 */
		$( document ).on(
			"click",
			".date-picker-wraper .ph-prev-day-time,.time-picker-wraper .ph-prev-day-time",
			function () {

				// $("#ph-calendar-time #ph-calendar-overlay").show();
				$( ".ph-ul-time" ).show();
				$( ".ph-ul-time .ph-calendar-overlay" ).show();
				var product_id        = jQuery( "#phive_product_id" ).val();
				var date              = jQuery( "#ph-booking-time-for-the-date" ).val();
				var date_obj          = new Date( date );
				var prev_day_date_obj = new Date( date_obj.getTime() - 86400000 );

				// The date string must be always with yyyy-mm-dd format
				var prev_day_date = prev_day_date_obj.getFullYear() + '-' + ("0" + (prev_day_date_obj.getMonth() + 1)).slice( -2 ) + '-' + ("0" + prev_day_date_obj.getDate()).slice( -2 );
				// jQuery('#ph-calendar-days li').each(function(){
				jQuery( '.ph-ul-date li' ).each(
					function () {
						jQuery( this ).removeClass( 'timepicker-selected-date' );
						sel_date       = new Date( jQuery( this ).find( '.callender-full-date' ).val() );
						next_prev_date = new Date( prev_day_date );
						if (parseInt( sel_date.getDate() ) == parseInt( next_prev_date.getDate() ) && parseInt( sel_date.getMonth() ) == parseInt( next_prev_date.getMonth() ) && parseInt( sel_date.getFullYear() ) == parseInt( next_prev_date.getFullYear() )) {
							jQuery( this ).addClass( 'timepicker-selected-date' );
						}
					}
				);
				var data = {
					action: 'phive_get_booked_datas_of_date',
					product_id: product_id,
					date: prev_day_date,
					type: 'time-picker',
					asset: $( ".input-assets" ).val(),
				};
				jQuery( ".ph-calendar-date" ).prop( 'disabled', true );
				$.post(
					phive_booking_locale.ajaxurl,
					data,
					function (res) {
						jQuery( ".ph-calendar-date" ).prop( 'disabled', false );
						// $("#ph-calendar-time").html(res).trigger('change');
						$( ".ph-ul-time" ).html( res );
						$( "#ph-calendar-time" ).trigger( 'change' );
						$( this ).addClass( "timepicker-selected-date" );
					}
				);
			}
		)
		function check_blocked_slots_between() {
			var select_present = false;
			jQuery( '.ph-ul-time li' ).each(
				function () {
					if (jQuery( this ).hasClass( 'selected-date' )) {
						select_present = true;
					}
					if ((jQuery( this ).hasClass( 'de-active' ) || jQuery( this ).hasClass( 'not-available' ) || jQuery( this ).hasClass( 'booking-full' ) || jQuery( this ).hasClass( 'booking-disabled' )) && select_present) {
						resetSelection();
						return false;
					}

				}
			);
		}
		function check_blocked_slots() {
			// jQuery('#ph-calendar-time li').each(function(){
			jQuery( '.ph-ul-time li' ).each(
				function () {
					if (jQuery( this ).hasClass( 'de-active' ) || jQuery( this ).hasClass( 'not-available' ) || jQuery( this ).hasClass( 'booking-full' ) || jQuery( this ).hasClass( 'booking-disabled' )) {
						resetSelection();
					}
					// need to check only the first slot is available or not
					return false;
				}
			);
		}
		$( document ).on(
			"change",
			".input-assets",
			function () {
				$( ".timepicker-selected-date" ).removeClass( "timepicker-selected-date" );
				// $("#ph-calendar-time").html('');
				$( ".ph-ul-time" ).html( '' );
				product_id = jQuery( "#phive_product_id" ).val();
				month      = jQuery( ".callender-month" ).val();
				year       = jQuery( ".callender-year" ).val();
				ph_load_calendar_values()
			}
		)

		function ph_load_calendar_values() {
			calender_type = jQuery( "#calender_type" ).val();
			if (calender_type == 'time') {
				calendar_for = 'time-picker';
			} else if (calender_type == 'date') {
				calendar_for = 'date-picker';
			} else {
				calendar_for = '';
			}

			if (calender_type == 'date') {
				if ($( "#book_interval_type" ).val() == 'fixed') {
					resetSelection();
				}
				// Case of 'To' date on next month, if de-active found after selection need to rest 'From'
				if ($( '.de-active' ).last().isAfter( '.selected-date' )) {
					resetSelection();
				}
			}
			var data = {
				action: 'phive_reload_callender',
				// security : phive_booking_locale.security,
				product_id: product_id,
				month: month,
				year: year,
				asset: $( ".input-assets" ).val(),
				calendar_for: calendar_for,
			};
			// $("#ph-calendar-overlay").show();
			$( ".ph-calendar-overlay" ).show();
			$.post(
				phive_booking_locale.ajaxurl,
				data,
				function (res) {
					// $("#ph-calendar-overlay").hide();
					$( ".ph-calendar-overlay" ).hide();

					result = jQuery.parseJSON( res );

					if (calender_type == 'time') {
						// $("#ph-calendar-time").html(result.time_slots);
						$( ".ph-ul-time" ).html( result.time_slots );
						$( ".ph-ul-time" ).html( '' );
					}

					if (jQuery( '#calender_type' ).val() == 'month') {
						display_text = phive_booking_locale.pick_a_month;
					} else {
						display_text = phive_booking_locale.Please_Pick_a_Date;
					}
					html_text = '<p id="booking_info_text" style="text-align:center;">' + display_text + '</p>';
					if ( ! jQuery( '.timepicker-selected-date' ).length) {
						$( ".booking-info-wraper" ).html( html_text );
						$( ".ph-ul-time" ).hide();
					}
					// $("#ph-calendar-days").html(result.days).change();
					// added .change() so that on change of calender days, auto selection of available dates is possible after assets change

					$( ".ph-ul-date" ).html( result.days );
					$( "#ph-calendar-days" ).change();

					jQuery( ".callender-month" ).val( result.month )
					jQuery( ".callender-year" ).val( result.year )

					// Month text not translatin in arabic language for polylang 192179
					if (result.display_month) {
						jQuery( ".span-month" ).html( result.display_month );
					} else {
						jQuery( ".span-month" ).html( phive_booking_locale.months[full_month.indexOf( result.month )] )
					}
					jQuery( ".span-year" ).html( result.display_year )

					if ( ! $( ".ph-date-from" ).val()) {
						$( ".single_add_to_cart_button" ).addClass( "disabled" );
					}
					// override_deactive_by_charge_by_night();
					// called the function to block unavailable dates when reloading the calendar
					block_unavailable_dates();
				}
			);
		}

		$( document ).on(
			'mouseover',
			'.ph-calendar-date',
			function (ev) {
				// alert($(ev.target).find('.callender-full-date').val());
				calender_type = $( '#book_interval_type' ).val();
				// alert(click);
				if (calender_type == 'fixed') {
					return true;
				} else if (calender_type == 'customer_choosen') {
					from = $( '.ph-date-from' ).val();
					$( ".ph-calendar-days li" ).removeClass( 'mouse_hover' );
					$( ".ph-calendar-days li" ).removeClass( 'mouse_hover_past' );
					if (from != '' && click != 2 && ! $is_booking_from_time_clicked) {
						// alert($( ".ph-calendar-days  li" ).index( this ));
						first         = $( ".ph-calendar-days .selected-date" ).first();
						first_index   = $( ".ph-calendar-days li" ).index( first );
						current_index = $( ".ph-calendar-days  li" ).index( this );
						// alert($( ".ph-calendar-days li").index( first ));
						if (first_index != -1 && parseInt( first_index ) < parseInt( current_index )) { // for next days
							// next=$( ".ph-calendar-days .selected-date:eq( "+(parseInt(first_index)+1)+" )" );
							next       = $( first ).next();
							next_index = $( ".ph-calendar-days li" ).index( next );

							if ($( next ).hasClass( 'de-active' ) || $( next ).hasClass( 'not-available' )) {
								// console.log(this);
								if ((is_overridable_by_charge_per_night( $( next ) )) && (this == next[0])) {
									// console.log(is_overridable_by_charge_per_night($(next)));
									$( next ).addClass( "mouse_hover" );
								}
							} else {
								$( next ).addClass( "mouse_hover" );
							}

							selected_blocks = parseInt( jQuery( ".selected-date" ).length );
							max_limit       = $( "#book_max_allowed_slot" ).val();
							// hover_count = selected_blocks;
							while (parseInt( next_index ) != -1 && parseInt( next_index ) < parseInt( current_index )) {
								next       = $( next ).next();
								next_index = $( ".ph-calendar-days li" ).index( next );
								if ($( next ).hasClass( 'de-active' ) || $( next ).hasClass( 'not-available' )) {
									break;
								}

								hover_count = parseInt( jQuery( ".mouse_hover:not(.selected-date)" ).length ) + selected_blocks;
								if (max_limit) {
									if (hover_count < max_limit) {
										$( next ).addClass( "mouse_hover" );
									} else {
										$( ".ph-calendar-days li.mouse_hover" ).each(
											function () {
												$( this ).removeClass( 'mouse_hover' );
											}
										);
										break;
									}
								} else {
									$( next ).addClass( "mouse_hover" );
								}
							}
						} else if (first_index != -1 && parseInt( first_index ) > parseInt( current_index )) { // if hovering past days
							if ( ! $( this ).hasClass( 'selected-date' )) {
								$( this ).addClass( "mouse_hover_past" );

								// $( ".ph-calendar-days li" ).each(function() {
								// $(this).removeClass('mouse_hover');
								// });
							} else {
								last       = $( ".ph-calendar-days li" ).last();
								last_index = $( ".ph-calendar-days li" ).index( last );
								next       = $( first ).next();
								next_index = $( ".ph-calendar-days li" ).index( next );
								while (parseInt( next_index ) != -1 && parseInt( next_index ) < parseInt( last_index )) {
									$( next ).addClass( "mouse_hover" );
									next       = $( next ).next();
									next_index = $( ".ph-calendar-days li" ).index( next );
									if ($( next ).hasClass( 'de-active' ) || $( next ).hasClass( 'not-available' )) {
										break;
									}
									$( next ).addClass( "mouse_hover" );
								}
							}

						}
					}
				}

			}
		);
		$( document ).on(
			'click',
			'.ph-calendar-date',
			function () {
				$( ".ph-calendar-days li" ).removeClass( 'mouse_hover' );
				$( ".ph-calendar-days li" ).removeClass( 'mouse_hover_past' );

			}
		);
		$( document ).on(
			'mouseleave',
			'.ph-calendar-date',
			function () {
				$( ".ph-calendar-days li" ).removeClass( 'mouse_hover' );
				$( ".ph-calendar-days li" ).removeClass( 'mouse_hover_past' );

			}
		);

		function convert_month_to_wp_format(date) {
			var wp_date_format = jQuery( "#ph_booking_wp_date_format" ).val();
			date               = ph_convert_month_to_wp_date_format( wp_date_format, date );
			return date;
		}
		function convert_date_to_wp_format(date, interval) {
			var wp_date_format = jQuery( "#ph_booking_wp_date_format" ).val();
			date               = ph_convert_date_to_wp_date_format( wp_date_format, date, interval );
			return date;
		}
		function timezoneOffset(date_string) {
			// passing default parameter value doesn't work in safari
			if (date_string === undefined || ! date_string) {
				date_string = '';
			}
			let date       = new Date( date_string ),
			timezoneOffset = date.getTimezoneOffset(),
			hours          = ('00' + Math.floor( Math.abs( timezoneOffset / 60 ) )).slice( -2 ),
			minutes        = ('00' + Math.abs( timezoneOffset % 60 )).slice( -2 ),
			string         = (timezoneOffset >= 0 ? '-' : '+') + hours + ':' + minutes;
			return string;
		}
		function convert_time_to_wp_format(date, interval) {
			var wp_time_format         = jQuery( "#ph_booking_wp_time_format" ).val();
			var across_the_day_booking = jQuery( '.across_the_day_booking' ).val();

			date_time = date.split( ' ' );
			date      = date_time[0] + 'T' + date_time[1] + timezoneOffset( date_time[0] + 'T' + date_time[1] );
			date_obj  = new Date( date );

			if ($( '.book_interval_period' ).val() == 'hour' && interval != '') {
				date_obj = new Date( date_obj.getTime() + ((interval) * 3600000) );

				if (across_the_day_booking != 'no') {
					date  = ("0" + date_obj.getDate()).slice( -2 );
					month = date_obj.getMonth();
					month = ("0" + (month + 1)).slice( -2 );

					year      = date_obj.getFullYear();
					next_date = year + '-' + month + '-' + date;
					next_date = convert_date_to_wp_format( next_date, '' );
					$( '.element_to_date' ).val( next_date );
				}
			} else if ($( '.book_interval_period' ).val() == 'minute' && interval != '') {
				date_obj = new Date( date_obj.getTime() + ((interval) * 60000) );
				if (across_the_day_booking != 'no') {
					date  = ("0" + date_obj.getDate()).slice( -2 );
					month = date_obj.getMonth();
					month = ("0" + (month + 1)).slice( -2 );

					year      = date_obj.getFullYear();
					next_date = year + '-' + month + '-' + date;
					next_date = convert_date_to_wp_format( next_date, '' );
					$( '.element_to_date' ).val( next_date );
				}

			}
			var hours = date_obj.getHours();
			var ampm  = hours >= 12 ? phive_booking_ajax.am_pm_to_text['pm'] : phive_booking_ajax.am_pm_to_text['am'];
			time      = ph_convert_time_to_wp_time_format( wp_time_format, date_obj, ampm );
			return time;
		}
		function ph_convert_month_to_wp_date_format(wp_format, date) {

			months   = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			new_date = new Date( date );

			switch (wp_format) {
				case 'F j, Y': display_date = months[new_date.getMonth()] + ', ' + new_date.getFullYear();
					break;
				case 'Y-m-d': display_date = new_date.getFullYear() + '-' + (new_date.getMonth() + 1);
					break;
				case 'm/d/Y': display_date = (new_date.getMonth() + 1) + '/' + new_date.getFullYear();
					break;
				case 'd/m/Y': display_date = (new_date.getMonth() + 1) + '/' + new_date.getFullYear();
					break;
				default: display_date = new_date.getFullYear() + '-' + (new_date.getMonth() + 1);
					break;

			}
			return display_date;
		}
		function ph_convert_date_to_wp_date_format(wp_format, date, interval) {
			months   = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			new_date = new Date( date + 'T' + '00:00' + timezoneOffset( date ) );
			if (interval != '') {
				from_date    = new Date( $( '.ph-date-from' ).val() );
				days_between = Date.daysBetween( from_date, new_date );
				// console.log(interval);
				// console.log(from_date);
				// console.log(date);
				// console.log(days_between);
				// console.log(new_date);
				// console.log(parseInt(days_between));
				days_between = parseInt( days_between ) + 1;
				no_of_blocks = (days_between) / interval;
				if (days_between % interval != 0) {
					no_of_blocks += 1;
				}
				days_to_add = (parseInt( no_of_blocks ) * interval) - 1;
				new_date    = new Date( from_date.getTime() + (parseInt( days_to_add ) * 86400000) );
			}
			month = ("0" + (new_date.getMonth() + 1)).slice( -2 );
			date  = ("0" + new_date.getDate()).slice( -2 );
			switch (wp_format) {
				case 'j F Y': display_date = date + ' ' + phive_booking_locale.months[new_date.getMonth()] + ' ' + new_date.getFullYear();
					break;
				case 'F j, Y': display_date = phive_booking_locale.months[new_date.getMonth()] + ' ' + date + ', ' + new_date.getFullYear();
					break;
				case 'Y-m-d': display_date = new_date.getFullYear() + '-' + month + '-' + date;
					break;
				case 'm/d/Y': display_date = month + '/' + date + '/' + new_date.getFullYear();
					break;
				case 'd/m/Y': display_date = date + '/' + month + '/' + new_date.getFullYear();
					break;
				default: display_date = new_date.getFullYear() + '-' + month + '-' + date;
					break;

			}
			return display_date;
		}
		Date.daysBetween = function (date1, date2) {
			// Get 1 day in milliseconds
			var one_day = 1000 * 60 * 60 * 24;

			// Convert both dates to milliseconds
			var date1_ms = date1.getTime();
			var date2_ms = date2.getTime();

			// Calculate the difference in milliseconds
			var difference_ms = date2_ms - date1_ms;

			// Convert back to days and return
			return Math.round( difference_ms / one_day );
		}
		function ph_convert_time_to_wp_time_format(wp_format, date, am_pm) {
			var hours   = date.getHours();
			var minutes = date.getMinutes();
			wp_format   = wp_format + "";
			switch (wp_format) {
				case "g:i a":
					hours        = hours % 12;
					hours        = hours ? hours : 12; // the hour '0' should be '12'
					minutes      = minutes < 10 ? '0' + minutes : minutes;
					display_time = hours + ':' + minutes + ' ' + am_pm.toLowerCase();
					break;
				case "g:i A":
					hours        = hours % 12;
					hours        = hours ? hours : 12; // the hour '0' should be '12'
					minutes      = minutes < 10 ? '0' + minutes : minutes;
					display_time = hours + ':' + minutes + ' ' + am_pm.toUpperCase();
					break;
				case "H:i":
					hours        = hours.toString().padStart( 2, 0 );
					minutes      = minutes.toString().padStart( 2, 0 );
					display_time = hours + ':' + minutes;
					break;
				case "G \\h i \\m\\i\\n":
					minutes      = minutes < 10 ? '0' + minutes : minutes;
					display_time = hours + ' h ' + minutes + ' min';
					break;
				default:
					hours        = hours % 12;
					hours        = hours ? hours : 12; // the hour '0' should be '12'
					minutes      = minutes < 10 ? '0' + minutes : minutes;
					display_time = hours + ':' + minutes + ' ' + am_pm.toUpperCase();
					break;

			}
			return display_time;
		}
		$( '.phive_book_assets' ).change(
			function () {
				// if($('#calendar_design').val()=='3')
				{

					$( ".ph-date-from" ).val( "" );
					$( ".ph-date-to" ).val( "" );
					$( '.element_from' ).val( "" );
					$( '.element_to' ).val( "" );
					$( '.element_from_date' ).val( "" );
					$( '.element_from_time' ).val( "" );
					$( '.element_to_date' ).val( "" );
					$( '.element_to_time' ).val( "" );
					resetSelection();
				}
			}
		);
	}
)

// Set the height of dates in date Calender
jQuery( window ).on(
	'load',
	function () {
		var display_capacity = jQuery( "#ph_display_booking_capacity" ).val();
		var calender_type    = jQuery( "#calender_type" ).val();

		if (display_capacity != 'yes' || calender_type == 'time') {
			jQuery( "li.ph-calendar-date" ).css( "min-height", "0" );
		}
	}
);

// Set the height of times in Time period Calender
jQuery( document ).ajaxComplete(
	function () {
		var display_capacity = jQuery( "#ph_display_booking_capacity" ).val();
		var calender_type    = jQuery( "#calender_type" ).val();
		if (calender_type == 'time' && display_capacity != 'yes') {
			jQuery( ".time-picker .ph-calendar-days li" ).css( "min-height", "0" );
		}
	}
);
