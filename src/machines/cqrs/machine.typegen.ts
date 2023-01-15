
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"done.invoke.create": { type: "done.invoke.create"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.delete": { type: "done.invoke.delete"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.read": { type: "done.invoke.read"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.readMore": { type: "done.invoke.readMore"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.remove": { type: "done.invoke.remove"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.update": { type: "done.invoke.update"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.create": { type: "error.platform.create"; data: unknown };
"error.platform.delete": { type: "error.platform.delete"; data: unknown };
"error.platform.read": { type: "error.platform.read"; data: unknown };
"error.platform.readMore": { type: "error.platform.readMore"; data: unknown };
"error.platform.remove": { type: "error.platform.remove"; data: unknown };
"error.platform.update": { type: "error.platform.update"; data: unknown };
"xstate.after(THROTTLE_TIME)#cqrs.busy": { type: "xstate.after(THROTTLE_TIME)#cqrs.busy" };
"xstate.after(TIME_TO_REFETCH)#cqrs.idle": { type: "xstate.after(TIME_TO_REFETCH)#cqrs.idle" };
"xstate.init": { type: "xstate.init" };
"xstate.stop": { type: "xstate.stop" };
        };
        invokeSrcNameMap: {
          "create": "done.invoke.create";
"delete": "done.invoke.delete";
"read": "done.invoke.read" | "done.invoke.readMore";
"remove": "done.invoke.remove";
"update": "done.invoke.update";
        };
        missingImplementations: {
          actions: "escalateError" | "removeLastQuery      " | "resetAttempts" | "setCurrentItems";
          delays: never;
          guards: never;
          services: "create" | "delete" | "read" | "remove" | "update";
        };
        eventsCausingActions: {
          "addCurrentToPrevious": "" | "xstate.stop";
"addQueryToCache": "done.invoke.read" | "done.invoke.readMore";
"escalateError": "error.platform.create" | "error.platform.delete" | "error.platform.read" | "error.platform.readMore" | "error.platform.remove" | "error.platform.update";
"getCachedIds": "";
"removeLastQuery      ": "done.invoke.readMore" | "error.platform.readMore" | "xstate.stop";
"resetAttempts": "";
"resetCache": "done.invoke.create" | "done.invoke.delete" | "done.invoke.remove" | "done.invoke.update" | "error.platform.create" | "error.platform.delete" | "error.platform.remove" | "error.platform.update" | "xstate.stop";
"setConfig": "SET_CONFIG";
"setCurrentItems": "";
"setCurrentQueryToPrevious": "done.invoke.readMore" | "error.platform.readMore" | "xstate.stop";
"setItems": "done.invoke.read" | "done.invoke.readMore";
"setQuery": "READ" | "READ_MORE";
        };
        eventsCausingDelays: {
          "THROTTLE_TIME": "" | "SET_CONFIG" | "done.invoke.read" | "done.invoke.readMore";
"TIME_TO_REFETCH": "" | "xstate.after(THROTTLE_TIME)#cqrs.busy";
        };
        eventsCausingGuards: {
          "cacheIsNotEmpty": "READ_MORE";
"itemsAreCached": "";
"queryIsCached": "";
"triesNotReached": "";
        };
        eventsCausingServices: {
          "create": "CREATE";
"delete": "DELETE";
"read": "" | "REFETCH" | "done.invoke.create" | "done.invoke.delete" | "done.invoke.remove" | "done.invoke.update" | "xstate.after(TIME_TO_REFETCH)#cqrs.idle";
"remove": "REMOVE";
"update": "UPDATE";
        };
        matchesStates: "busy" | "cache" | "cache.more" | "cache.more.check" | "cache.more.items" | "cache.query" | "cache.query.check" | "cache.query.items" | "config" | "create" | "delete" | "error" | "idle" | "read" | "readMore" | "remove" | "update" | { "cache"?: "more" | "query" | { "more"?: "check" | "items";
"query"?: "check" | "items"; }; };
        tags: never;
      }
  