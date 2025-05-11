# Resolving Netlify Build Failures Due to Dependency Conflicts

**Date:** 2025-05-11

## Issue Context:
The Netlify deployment pipeline was consistently failing during the "Install dependencies" stage. The errors reported by `npm` (used in the Netlify build environment) were `ERESOLVE` issues. This indicated an inability for `npm` to construct a valid dependency tree based on the versions specified in `package.json` and the transitive dependencies of the project. These issues arose even if `yarn` (used locally) might have resolved them with warnings or through different resolution strategies.

## Problem 1: `date-fns` Version Conflict

*   **Symptom:** The build log showed:
    ```
    npm error ERESOLVE unable to resolve dependency tree
    npm error While resolving: better-call-buffet-front@0.0.1
    npm error Found: date-fns@4.1.0
    npm error peer date-fns@"^2.28.0 || ^3.0.0" from react-day-picker@8.10.1
    ```
*   **Cause:** The project directly depended on `date-fns@4.1.0`, while a transitive dependency, `react-day-picker@8.10.1`, required a version of `date-fns` in the range `^2.28.0 || ^3.0.0`.
*   **Solution:** The `date-fns` package was updated to a compatible version (`3.0.0`) using the command:
    ```bash
    yarn add date-fns@^3.0.0
    ```

## Problem 2: `react` Version Conflict with `react-day-picker`

*   **Symptom:** After resolving the `date-fns` issue, a new `ERESOLVE` error appeared:
    ```
    npm error ERESOLVE unable to resolve dependency tree
    npm error While resolving: better-call-buffet-front@0.0.1
    npm error Found: react@19.1.0
    npm error peer react@"^16.8.0 || ^17.0.0 || ^18.0.0" from react-day-picker@8.10.1
    ```
*   **Cause:** The project was configured to use `react@19.1.0`. However, the installed version of `react-day-picker` (`8.10.1`) did not yet support React 19 and required an older version (React 16, 17, or 18).
*   **Solution Path:**
    1.  An initial suggestion was to downgrade React to version 18 to match `react-day-picker@8.10.1`'s compatibility.
    2.  The user preferred to explore options that would allow keeping React 19.
    3.  A web search indicated that `react-day-picker` versions `9.4.3` and newer offer support for React 19.
    4.  `react-day-picker` was upgraded to its latest version (`9.6.7`) which supports React 19. This was done using:
        ```bash
        yarn add react-day-picker@^9.6.7
        ```
        Notably, this upgrade also automatically re-added `react@19.1.0` and `react-dom@19.1.0` to the project dependencies, as `yarn` resolved `react-day-picker@9.6.7`'s peer dependency on React 19.

## Problem 3: Missing Project-Level Peer Dependencies

*   **Symptom:** Throughout the process, `yarn` (run locally) consistently issued warnings about unmet peer dependencies for the root project. These were anticipated to cause `npm` errors in the CI environment:
    *   `better-call-buffet-front@workspace:. doesn't provide @testing-library/dom, requested by @testing-library/react.`
    *   `better-call-buffet-front@workspace:. doesn't provide vite, requested by @tailwindcss/vite and other dependencies.`
*   **Cause:** While `@testing-library/react` and `@tailwindcss/vite` were installed, their peer dependencies (`@testing-library/dom` and `vite` respectively) were not explicitly listed as direct dependencies of the project.
*   **Solution:** These missing packages were added as development dependencies:
    ```bash
    yarn add -D @testing-library/dom vite
    ```

## Summary of Actions & Affected Files:

The primary files affected by these changes were `package.json` and `yarn.lock`.
The sequence of commands run to resolve the issues was:
1.  `yarn add date-fns@^3.0.0`
2.  `yarn add react-day-picker@^9.6.7`
3.  `yarn add -D @testing-library/dom vite`

These steps collectively addressed the dependency conflicts, allowing the project to utilize React 19 while ensuring compatibility with `react-day-picker` and satisfying all necessary peer dependencies for a successful build on Netlify.
