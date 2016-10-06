# Roads

Client route helpers for Phoenix inspired by Rails JSRoutes.

This is for the guys who want to write DRY code, avoid reimplementing route helper in javascript like:

```js
function postPath(id) {
  return "/api/posts/" + id;
}
```

## Installation

  1. Add `roads` to your list of dependencies in `mix.exs`:

    ```elixir
    def deps do
      [{:roads, "~> 0.1.0"}]
    end
    ```
