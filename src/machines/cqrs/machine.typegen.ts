
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"done.invoke.create": { type: "done.invoke.create"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.delete": { type: "done.invoke.delete"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.read": { type: "done.invoke.read"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.remove": { type: "done.invoke.remove"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.update": { type: "done.invoke.update"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.create": { type: "error.platform.create"; data: unknown };
"error.platform.delete": { type: "error.platform.delete"; data: unknown };
"error.platform.read": { type: "error.platform.read"; data: unknown };
"error.platform.remove": { type: "error.platform.remove"; data: unknown };
"error.platform.update": { type: "error.platform.update"; data: unknown };
"xstate.after(THROTTLE_TIME)#cqrs.busy": { type: "xstate.after(THROTTLE_TIME)#cqrs.busy" };
"xstate.init": { type: "xstate.init" };
"xstate.stop": { type: "xstate.stop" };
        };
        invokeSrcNameMap: {
          "create": "done.invoke.create";
"delete": "done.invoke.delete";
"read": "done.invoke.read";
"remove": "done.invoke.remove";
"update": "done.invoke.update";
        };
        missingImplementations: {
          actions: "'cqrs/removeLastQuery'" | "addToPreviousQuery" | "create" | "delete" | "remove" | "resetCache" | "setCurrentItems" | "setItems" | "setQuery" | "update";
          delays: "THROTTLE_TIME";
          guards: "itemsAreCached" | "queryIsCached" | "triesNotReached";
          services: "create" | "delete" | "read" | "remove" | "update";
        };
        eventsCausingActions: {
          "'cqrs/removeLastQuery'": "" | "xstate.stop";
"addToPreviousQuery": "" | "xstate.stop";
"create": "done.invoke.create";
"delete": "done.invoke.delete";
"remove": "done.invoke.remove";
"resetCache": "done.invoke.create" | "done.invoke.delete" | "done.invoke.remove" | "done.invoke.update" | "error.platform.create" | "error.platform.delete" | "error.platform.remove" | "error.platform.update" | "xstate.stop";
"setCurrentItems": "";
"setItems": "done.invoke.read";
"setQuery": "READ" | "READ_MORE";
"update": "done.invoke.update";
        };
        eventsCausingDelays: {
          "THROTTLE_TIME": "" | "done.invoke.create" | "done.invoke.delete" | "done.invoke.read" | "done.invoke.remove" | "done.invoke.update" | "xstate.init";
        };
        eventsCausingGuards: {
          "itemsAreCached": "";
"queryIsCached": "";
"triesNotReached": "";
        };
        eventsCausingServices: {
          "create": "CREATE";
"delete": "DELETE";
"read": "";
"remove": "REMOVE";
"update": "UPDATE";
        };
        matchesStates: "busy" | "cache" | "cache.more" | "cache.more.check" | "cache.more.items" | "cache.query" | "cache.query.check" | "cache.query.items" | "create" | "delete" | "error" | "idle" | "read" | "remove" | "update" | { "cache"?: "more" | "query" | { "more"?: "check" | "items";
"query"?: "check" | "items"; }; };
        tags: never;
      }
  