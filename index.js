const core = require('@actions/core');
const github = require('@actions/github');
const { promises: fs } = require('fs');


try {
  // `who-to-greet` input defined in action metadata file

  const yamlFilePath = core.getInput('yaml-file');
  console.log(yamlFilePath);
  
  const yamlFileText = fs.readFileSync(yamlFilePath, {encoding:"utf8"}) ;

  var costs = estimateCosts(yamlFileText, "ap-east-1", "asia-east1", "australiaeast")
  core.setOutput("costs", costs)

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

} catch (error) {
  core.setFailed(error.message);
}

round = function (e, a) {
    return Number(Math.round(e + "e" + a) + "e-" + a)
},

function estimateCosts(yamlFileText, aws_region, google_region, azure_region) {
    $.post({
        url: "https://calculator.getoctane.io/cost",
        data: JSON.stringify({
            config: yamlFileText.val(),
            amazon_region: aws_region.val(),
            google_region: google_region.val(),
            azure_region: azure_region.val()
            
        }),
        contentType: "application/json"
    }).done(function (e) {
        console.log(e);
        var a = [{
            provider: "amazon",
            total_price: e.total_costs.amazon[0].total_price
        }, {
            provider: "google",
            total_price: e.total_costs.google[0].total_price
        }, {
            provider: "azure",
            total_price: e.total_costs.azure[0].total_price
        }];
        a.sort(function (e, a) {
            return e.total_price > a.total_price | "None" == e.total_price ? 1 : -1
        });
        for (var t = 0; t < 3; t++) {
            var o = a[t].provider;
            if ($(".cloud-provider-logo-" + t).attr("src", logos[o]), e.errors[o]) $("#provider-error-message-" + t).html(e.errors[o]), $("#provider-error-" + t).removeClass("collapsed"), $("#provider-result-" + t).addClass("collapsed");
            else {
                $("#provider-error-message-" + t).html("");
                var s = e.total_costs[o][0];
                $("#provider-monthly-price-" + t).html("$" + (24 * s.total_price * 30).toFixed(2)), $("#provider-hourly-price-" + t).html("$" + s.total_price.toFixed(2)), $("#provider-region-" + t).html(s.region), "None" == s.type ? ($("#provider-machine-type-" + t).addClass("collapsed"), $("#provider-machine-count-" + t).addClass("collapsed"), $("#provider-machine-cpu-" + t).addClass("collapsed"), $("#provider-machine-memory-" + t).addClass("collapsed")) : ($("#provider-machine-type-" + t).removeClass("collapsed"), $("#provider-machine-count-" + t).removeClass("collapsed"), $("#provider-machine-cpu-" + t).removeClass("collapsed"), $("#provider-machine-memory-" + t).removeClass("collapsed")), $("#provider-machine-type-" + t).html(s.type), $("#provider-machine-count-" + t).html(s.num_nodes_needed + " machines"), $("#provider-machine-cpu-" + t).html(s.cpu + " vCPU"), $("#provider-machine-memory-" + t).html(s.memory + " GiB RAM"), $("#provider-machine-storage-" + t).html("None" == s.storage ? "no storage" : s.storage + " GiB Storage");
                var r = e.component_costs[o].sort(function (e, a) {
                        return e.total_price < a.total_price ? 1 : -1
                    }).slice(0, 5),
                    n = [],
                    i = [],
                    l = !0,
                    c = !1,
                    p = void 0;
                try {
                    for (var u, d = r[Symbol.iterator](); !(l = (u = d.next()).done); l = !0) {
                        var m = u.value;
                        n.push(m.name), i.push(m.total_price)
                    }
                } catch (e) {
                    c = !0, p = e
                } finally {
                    try {
                        l || null == d.return || d.return()
                    } finally {
                        if (c) throw p
                    }
                }
            }
        }
    }).fail(function (e, a, t) {
        console.log(e);
        var o = "Error";
        switch (e.responseJSON.error_type) {
            case "NO_CONFIG":
                o = "Please enter a Kubernetes yaml config or try running our demo example to get started.";
                break;
            case "NO_SUPPORTED_COMPONENTS":
                o = "No supported Kubernetes resources specified in config (see the listed supported objects below). Also send us an email at team@getoctane.io if you are interested in us adding resources.";
                break;
            case "INVALID_CONFIG":
                o = "The Kubernetes resource specified is invalid. Try running our demo example to get started.<br>" + e.responseJSON.message;
                break;
            case "NO_RESOURCES_SET":
                o = "The Kubernetes resources specified do not have resource limits set, please set those in the yaml under template.spec.containers.resources.limits and rerun the estimation. If you are unsure of what to set sign up for our beta to help predict those configuration values by emailing team@getoctane.io."
        }
    })
}