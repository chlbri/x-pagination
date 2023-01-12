
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"xstate.after(DISPLAY_TIME)#pagination.work.pagination.busy": { type: "xstate.after(DISPLAY_TIME)#pagination.work.pagination.busy" };
"xstate.after(QUERY_ERROR)#pagination.work.idle": { type: "xstate.after(QUERY_ERROR)#pagination.work.idle" };
"xstate.init": { type: "xstate.init" };
"xstate.stop": { type: "xstate.stop" };
        };
        invokeSrcNameMap: {
          
        };
        missingImplementations: {
          actions: never;
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
"escalateTimeError": "xstate.after(QUERY_ERROR)#pagination.work.idle";
"send/currentItems": "";
"send/first": "SEND/FIRST_PAGE";
"send/goto": "SEND/GOTO";
"send/last": "SEND/LAST_PAGE";
"send/next": "SEND/NEXT";
"send/notifyTakesTooLong": "";
"send/previous": "SEND/PREVIOUS";
"setCurrentItems": "";
"setCurrentPage": "RECEIVE";
"setDefaultPage": "";
"setDefaultPageSize": "CONFIG";
"setEmptyPages": "";
"setName": "CONFIG";
"setPageSize": "SET_PAGE_SIZE";
"setTotal": "";
"setTotalPages": "";
"startQueryTimer": "SEND/FIRST_PAGE" | "SEND/GOTO" | "SEND/LAST_PAGE" | "SEND/NEXT" | "SEND/PREVIOUS" | "SET_PAGE_SIZE" | "xstate.stop";
        };
        eventsCausingDelays: {
          "DISPLAY_TIME": "";
"QUERY_ERROR": "" | "CONFIG" | "SEND/FIRST_PAGE" | "SEND/GOTO" | "SEND/LAST_PAGE" | "SEND/NEXT" | "SEND/PREVIOUS";
        };
        eventsCausingGuards: {
          "itemsNotEmpty": "";
"noCurrentPage": "";
"queryIsStarted": "xstate.after(QUERY_ERROR)#pagination.work.idle";
"queryTakesTooLong": "";
        };
        eventsCausingServices: {
          
        };
        matchesStates: "config" | "error" | "work" | "work.idle" | "work.pagination" | "work.pagination.busy" | "work.pagination.config" | "work.pagination.ready" | "work.transformation" | "work.transformation.config" | "work.transformation.ids" | "work.transformation.pages" | "work.transformation.totals" | { "work"?: "idle" | "pagination" | "transformation" | { "pagination"?: "busy" | "config" | "ready";
"transformation"?: "config" | "ids" | "pages" | "totals"; }; };
        tags: never;
      }
  