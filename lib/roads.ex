defmodule Roads do
  def compile(routes, config) do
    payload = payload(routes, config)
    checksum = checksum(payload)

    if checksum != last_checksum(config) do
      {:ok, source
        |> String.replace(~r/__PAYLOAD__/, payload)
        |> expose_global(config[:global_name])
        |> String.replace(~r/__CHECKSUM__/, checksum)
      }
    else
      { :build_cache_hit, nil }
    end
  end

  def install(compiled, config) do
    case compiled do
      {:ok, content } -> File.write(config[:out_file], content)
      {:build_cache_hit, _} -> nil
    end
  end

  defp normalize(routes) do
    routes
    |> Enum.map(
      fn (%{path: path, opts: opts, kind: kind, helper: helper}) ->
        %{path: path, opts: opts, kind: kind, helper: helper}
      end
    )
  end

  defp payload(routes, config) do
    Poison.encode! %{
      "routes" => normalize(routes),
      "globalName" => config[:global_name],
      "camelcase" => config[:camelcase]
    }
  end

  def expose_global(content, global_name) do
    if is_nil(global_name) do
      content
    else
      String.replace(content, ~r/module.exports/, "window['#{global_name}']")
    end
  end

  defp source do
    File.read! Application.app_dir(:roads, ["priv", "roads.source.js"])
  end

  defp checksum(str) do
    :crypto.hash(:sha256, str)
    |> Base.encode16
    |> String.downcase
  end

  defp last_checksum(config) do
    file_path = config[:out_file]
    if File.exists?(file_path) do
      File.stream!(file_path)
      |> Stream.map(&Regex.run(~r/\s*\/\*\*\s*\@checksum\s([0-9a-z]+)*/, &1))
      |> Stream.filter(fn(m) -> m != nil end)
      |> Stream.take(1)
      |> Enum.to_list
      |> Enum.at(0)
      |> Enum.at(1)
    else
      nil
    end
  end
end
