jQuery(document).ready(function ($) {
  // Strict Validation Logic
  function strictValidate(input) {
    var $input = $(input);
    var inputVal = $.trim($input.val());
    var check_field = $input
      .closest(".elementor-field-type-telephone")
      .find(".phone_check");

    // 1. Check for '+' (Manual Country Code Indicator)
    if (inputVal.indexOf("+") !== -1) {
      invalidateField($input, check_field);
      return;
    }

    // Check if intl-tel-input is initialized
    if (!$input.data("intlTelInput")) {
      // Not initialized yet? validation might happen later.
      return;
    }

    // 2. Check Valid Number (Base Validation)
    if (!$input.intlTelInput("isValidNumber")) {
      invalidateField($input, check_field);
      return;
    }

    // 3. Strict National Format Check
    try {
      // Get the formatted numbers
      var nationalFormat = $input.intlTelInput(
        "getNumber",
        intlTelInputUtils.numberFormat.NATIONAL
      );

      // Clean non-digits for comparison (keep only invalid characters that might matter? No, compare digits)
      // Actually, we want to ensure the USER INPUT doesn't have extra digits (like country code).

      var cleanInput = inputVal.replace(/\D/g, "");
      var cleanNational = nationalFormat.replace(/\D/g, "");

      // Basic Check: If the cleaned input matches the cleaned NATIONAL format, it's likely correct.
      // If the user typed "2011..." (Egypt code 20) and National is "011...",
      // cleanInput = "2011...", cleanNational = "011...". NO MATCH. -> Invalid.
      // If user typed "011...", cleanInput = "011...", cleanNational = "011...". MATCH. -> Valid.

      // Note: Some national formats might vary slightly, but for "Telephone field" plugin usage pattern
      // where separateDialCode is usually TRUE, the input should strictly match the national part.

      if (cleanInput !== cleanNational) {
        invalidateField($input, check_field);
        return;
      }
    } catch (e) {
      console.error("Validation Error:", e);
      // Fallback to basic valid check if utils not loaded
      if (!$input.intlTelInput("isValidNumber")) {
        invalidateField($input, check_field);
        return;
      }
    }

    // If we got here, it's VALID
    markValidField($input, check_field);
  }

  function invalidateField($input, check_field) {
    check_field.attr("value", "no");
    check_field.val("no");
    $input
      .addClass("wpcf7-not-valid-red")
      .removeClass("wpcf7-not-valid-blue")
      .removeClass("wpcf7-not-valid");
    // We use 'wpcf7-not-valid-red' because the original plugin seems to use it for invalid state
    // Original: $(this).addClass('wpcf7-not-valid-red').removeClass('wpcf7-not-valid-blue');
  }

  function markValidField($input, check_field) {
    check_field.attr("value", "yes");
    check_field.val("yes");
    $input
      .addClass("wpcf7-not-valid-blue")
      .removeClass("wpcf7-not-valid-red")
      .removeClass("wpcf7-not-valid");
  }

  // Attach Listeners
  // We attach to body to handle dynamic inputs (Popups, Repeater fields)
  $("body").on("keyup change blur", ".elementor-field-telephone", function () {
    strictValidate(this);
  });

  // Run once on load just in case
  // setTimeout to allow original plugin to init
  setTimeout(function () {
    $(".elementor-field-telephone").each(function () {
      strictValidate(this);
    });
  }, 1000);
});
