# Roads

Client route helpers for Phoenix inspired by Rails JSRoutes.

This is for the guys who want to write DRY code, avoid reimplementing router helper in javascript like:

```js
function postPath(id) {
  return "/api/posts/" + id;
}
```

## Usage
Roads has similar signature to Phoenix router helper

```js
import Roads from './roads';

Roads.blog_path("index") // Output: /blogs
Roads.blog_path("show", 1) // Output: /blogs/1
Roads.blog_comment_path("index", 1, { sort: 'popular' }) // Output: /blogs/1/comments?sort=popular
Roads.blog_comment_path("show", 1, 2) // Output: /blogs/1/comments/2
```

We can change to use camelCase instead of snake_case (require configuration):

```js
import Roads from './roads';

Roads.blogPath("show", 1) // Output: /blogs/1
Roads.blogCommentPath("index", 1, { sort: 'popular' }) // Output: /blogs/1/comments?sort=popular
```

## Installation

  1. Add `roads` to your list of dependencies in `mix.exs`:

  ```elixir
  def deps do
    [{:roads, "~> 0.1.1"}]
  end
  ```
  
## Setup

#### Compilers
In order to use Roads, we need to add it to the compilers:

```elixir
# mix.esx
def project do
    [app: :our_app,
    ...
    compilers: [:phoenix, :gettext] ++ Mix.compilers ++ [:roads]
    ...]
end
```

We need to put `:roads` after `Mix.compilers` because the `router.ex` must be compiled before we run `:roads` compiler.

#### Code reload
This is to make javascript file to be generated every time we change the `outer.ex`

```elixir
# config/dev.exs
config :our_app, MyApp.Endpoint,
  reloadable_compilers: [:gettext, :phoenix, :elixir, :roads]
```

#### Configuration
Here is the default configurations, all are optional, only add when you need to:
```elixir
# config/config.exs
config :our_app, :roads,
  out_file: "web/static/js/roads.js", # Output file
  camelcase: false, # Change to true if you prefer to use camelCase rather than snake_case
  global_name: nil # Will expose to window[global_name] when you want to use as standalone library.
```
