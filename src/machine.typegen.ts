
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"done.invoke.getUser": { type: "done.invoke.getUser"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.pagination.config:invocation[0]": { type: "done.invoke.pagination.config:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.getUser": { type: "error.platform.getUser"; data: unknown };
"error.platform.pagination.config:invocation[0]": { type: "error.platform.pagination.config:invocation[0]"; data: unknown };
"xstate.after(DISPLAY_TIME)#pagination.work.pagination.busy": { type: "xstate.after(DISPLAY_TIME)#pagination.work.pagination.busy" };
"xstate.after(QUERY_ERROR)#pagination.work.idle": { type: "xstate.after(QUERY_ERROR)#pagination.work.idle" };
"xstate.init": { type: "xstate.init" };
"xstate.stop": { type: "xstate.stop" };
        };
        invokeSrcNameMap: {
          "config": "done.invoke.pagination.config:invocation[0]";
"getUser": "done.invoke.getUser";
        };
        missingImplementations: {
          actions: "constructIds" | "constructPages" | "send/first" | "send/goto" | "send/last" | "send/next" | "send/previous" | "sendCurrentItems" | "setCurrentItems" | "setDefaultPage" | "setPageSize" | "setTotal" | "setTotalPages";
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "assignAllTotal": "RECEIVE";
"assignItems": "RECEIVE";
"closeQueryTimer": "" | "xstate.stop";
"constructIds": "";
"constructPages": "";
"escalateConfigError": "error.platform.pagination.config:invocation[0]";
"escalateTimeError": "xstate.after(QUERY_ERROR)#pagination.work.idle";
"escalateUserError": "error.platform.getUser";
"send/first": "SEND/FIRST_PAGE";
"send/goto": "SEND/GOTO";
"send/last": "SEND/LAST_PAGE";
"send/next": "SEND/NEXT";
"send/notifyTakesTooLong": "";
"send/previous": "SEND/PREVIOUS";
"sendCurrentItems": "";
"setConfig": "done.invoke.pagination.config:invocation[0]";
"setCurrentItems": "";
"setCurrentPage": "RECEIVE";
"setDefaultPage": "";
"setDefaultPageSize": "" | "NAME" | "SEND/FIRST_PAGE" | "SEND/GOTO" | "SEND/LAST_PAGE" | "SEND/NEXT" | "SEND/PREVIOUS";
"setEmptyPages": "";
"setName": "NAME";
"setPageSize": "SEND/SET_PAGE_SIZE";
"setTotal": "";
"setTotalPages": "";
"setUser": "done.invoke.getUser";
"startQueryTimer": "SEND/FIRST_PAGE" | "SEND/GOTO" | "SEND/LAST_PAGE" | "SEND/NEXT" | "SEND/PREVIOUS" | "xstate.stop";
        };
        eventsCausingDelays: {
          "DISPLAY_TIME": "";
"QUERY_ERROR": "" | "NAME" | "SEND/FIRST_PAGE" | "SEND/GOTO" | "SEND/LAST_PAGE" | "SEND/NEXT" | "SEND/PREVIOUS";
        };
        eventsCausingGuards: {
          "itemsNotEmpty": "";
"noCurrentPage": "";
"queryIsStarted": "xstate.after(QUERY_ERROR)#pagination.work.idle";
"queryTakesTooLong": "";
        };
        eventsCausingServices: {
          "config": "done.invoke.getUser";
"getUser": "xstate.init";
        };
        matchesStates: "config" | "error" | "name" | "user" | "work" | "work.idle" | "work.pagination" | "work.pagination.busy" | "work.pagination.config" | "work.pagination.ready" | "work.transformation" | "work.transformation.config" | "work.transformation.ids" | "work.transformation.pages" | "work.transformation.totals" | { "work"?: "idle" | "pagination" | "transformation" | { "pagination"?: "busy" | "config" | "ready";
"transformation"?: "config" | "ids" | "pages" | "totals"; }; };
        tags: never;
      }
  