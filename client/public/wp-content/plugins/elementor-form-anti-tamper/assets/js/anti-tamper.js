jQuery(document).ready(function($) {
    var wrapperId = 'emar-form';
    var observedForms = new WeakSet();

    function attachObserver(targetFormWrapper) {
        var $wrapper = $(targetFormWrapper);
        var formElement = $wrapper.find('form')[0];

        if (!formElement) {
            return;
        }

        if (observedForms.has(formElement)) {
            return;
        }
        observedForms.add(formElement);


        var tamperingDetected = false;
        var isSubmitting = false; 
        var lastUserInteraction = Date.now();
        var observer; 

        // Track user interaction (Use Capture Phase to ignore stopPropagation from other scripts)
        var interactionEvents = ['mousedown', 'mouseup', 'click', 'keydown', 'touchstart', 'input', 'change', 'focusin'];
        interactionEvents.forEach(function(eventType) {
             document.addEventListener(eventType, function() {
                 lastUserInteraction = Date.now();
             }, true); // Capture = true
        });

        // DEBUG: Verbose Logging Function
        function debugLog(msg, data) {
            // console.log('%c[Anti-Tamper] ' + msg, 'color: #e67e22; font-weight: bold;', data || '');
        }

        function showTamperError(reason, details) {
            if (!tamperingDetected && !isSubmitting) {
                tamperingDetected = true;
                // debugLog('Security Alert Triggered!', { reason: reason, details: details });
                console.warn('Anti-Tamper: Security Alert!', reason, details);

                var readableReason = reason + (details ? ' (' + details + ')' : '');
                var errorMsg = '<div class="elementor-message elementor-message-danger" role="alert" style="margin-bottom: 20px; font-weight: bold;">PLEASE STOP AND REFRESH THE PAGE</div>';
                
                $(formElement).find('.elementor-message').remove();
                $(formElement).prepend(errorMsg);
                $(formElement).find('button[type="submit"]').prop('disabled', true).addClass('elementor-button-disabled');
            }
        }

        formElement.addEventListener('submit', function(e) {
            if (tamperingDetected) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                return false;
            }
            // Flag submission start to pause observer checks
            isSubmitting = true;
        }, true);

        // LISTEN FOR BUTTON CLICK (Capture Phase)
        // Elementor often hijacks the button click. We need to catch it first to set isSubmitting.
        var submitBtn = formElement.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                if (tamperingDetected) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                }
                isSubmitting = true;
            }, true);
        }

        // LISTEN FOR SUCCESSFUL SUBMISSION
        // If Elementor reports success, we should stop monitoring to prevent 
        // field resets from triggering the alarm.
        $(formElement).on('submit_success', function() {
             if (observer) {
                 observer.disconnect();
                 observer = null;
             }
             isSubmitting = true; // Ensure we stay in submitting state to be safe
             tamperingDetected = false; 
        });

        // LISTEN FOR SUBMISSION ERROR
        $(formElement).on('submit_error', function() {
            isSubmitting = false;
            // CRITICAL: Update interaction time. 
            lastUserInteraction = Date.now();
        });

        var config = { 
            attributes: true, 
            childList: true, 
            subtree: true,
            characterData: true
        };

        var callback = function(mutationsList, observer) {
            // IGNORE ALL MUTATIONS IF SUBMITTING
            // 1. Check internal flag
            if (isSubmitting) {
                return;
            }
            // 2. Check Elementor's status class (Backup if event listeners failed)
            if (formElement.classList.contains('elementor-form-waiting')) {
                return;
            }

            var now = Date.now();
            var timeSinceInteraction = now - lastUserInteraction;
            
            // Threshold 5000ms - Balanced
            var isInteractionRecent = timeSinceInteraction < 5000;

            for(var mutation of mutationsList) {
                
                // CHECK FOR SUCCESS MESSAGE INSERTION
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for(var i=0; i<mutation.addedNodes.length; i++) {
                        var node = mutation.addedNodes[i];
                        if (node.nodeType === 1 && (node.classList.contains('elementor-message-success') || node.classList.contains('elementor-message'))) {
                            observer.disconnect();
                            return; // Stop processing
                        }
                    }
                }

                if (mutation.type === 'attributes') {
                    var attrName = mutation.attributeName;
                    var target = mutation.target;
                    var nodeName = target.nodeName.toUpperCase();
                    
                    // 1. SAFE ATTRIBUTES
                    if (['class', 'style', 'tabindex', 'role'].includes(attrName) || attrName.startsWith('aria-') || attrName.startsWith('data-')) {
                        continue;
                    }
                    
                    // 2. BLOCKLIST
                    var dangerousAttributes = ['value', 'name', 'type', 'title', 'id', 'min', 'max', 'step', 'readonly', 'disabled', 'required', 'pattern', 'action', 'method'];
                    
                    if (!dangerousAttributes.includes(attrName)) {
                        continue;
                    }

                    // 3. IGNORE BUTTONS
                    if (nodeName === 'BUTTON' || (nodeName === 'INPUT' && target.type === 'submit')) {
                        continue;
                    }

                    // 4. IGNORE FIELD RESETS (Value becomes empty)
                    if (attrName === 'value' && (target.value === '' || target.getAttribute('value') === '')) {
                        continue;
                    }

                    if (!isInteractionRecent) {
                         showTamperError('Attribute ' + attrName + ' changed (' + timeSinceInteraction + 'ms since interaction)');
                    }
                }
                else if (mutation.type === 'childList') {
                    // Logic for nodes added/removed
                    var allNodes = [];
                    mutation.removedNodes.forEach(function(n){ allNodes.push({node:n, type:'removed'}); });
                    mutation.addedNodes.forEach(function(n){ allNodes.push({node:n, type:'added'}); });

                    allNodes.forEach(function(item) {
                        var node = item.node;
                        if (node.nodeType === 1) {
                            var nodeName = node.nodeName.toUpperCase();
                            // Checks
                            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(nodeName) || node.querySelector('input, select, textarea')) {
                                if (!isInteractionRecent) {
                                     // SILENCED: Removing a field is allowed (e.g. dynamic forms or cleanup)
                                     // debugLog('Warning: Form input removed programmatically', { node: node });
                                }
                            }
                        }
                    });
                }
            }
        };

        observer = new MutationObserver(callback);
        observer.observe(formElement, config);
    }

    // 1. Check if form exists on load
    $('#' + wrapperId).each(function() {
        attachObserver(this);
    });

    // 2. Watch for dynamic injections (Popups, AJAX)
    var globalObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { 
                        if (node.id === wrapperId) {
                            attachObserver(node);
                        }
                        if (node.querySelector) {
                            var found = node.querySelector('#' + wrapperId);
                            if (found) {
                                attachObserver(found);
                            }
                        }
                    }
                });
            }
        });
    });

    globalObserver.observe(document.body, { childList: true, subtree: true });
});
