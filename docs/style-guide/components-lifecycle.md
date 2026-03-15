# Components Lifecycle

A Component should follow this order:

- Loading
- Error or Success
- Content

No matter the state, the component should always occupy the same space.

1. _Loading_:
   A Skeleton is used while the data of the component is not loaded yet.
2. In case of an **Error**
   We display a friendly message to the user. The exception is when we're absolutely sure the Back End has returned the friendly message for us.
3. **Empty State**:

- If there's _no error_ , _data is not being fetched_ but there's _no data_, we display a friendly message accordingly to what we would display in case of _success_.

4. _Content_:

- If there's _no error_ , _data was fetched_ and we _have data_, we display the content of the component.
