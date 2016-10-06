defmodule Mix.Tasks.Compile.Roads do
  @default_config [
    out_file: "web/static/js/roads.js",
    camelcase: false,
    global_name: "Roads"
  ]

  def run(_args) do
    router
    |> routes
    |> Roads.compile(config)
    |> Roads.install(config)
  end

  defp router do
    Module.concat(Mix.Phoenix.base(), "Router")
  end

  def config do
    result = (Mix.Project.config[:app] |> Application.get_env(:roads)) || []
    Keyword.merge(@default_config, result)
  end

  defp routes(router) do
    router.__routes__
  end
end
