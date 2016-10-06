defmodule Roads.Mixfile do
  use Mix.Project

  def project do
    [app: :roads,
     version: "0.1.1",
     elixir: "~> 1.3",
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     description: description,
     package: package,
     deps: deps()]
  end

  defp description do
    """
    Client route helpers for Phoenix inspired by Rails JSRoutes.
    """
  end

  defp package do
  [name: :roads,
   files: ["lib", "priv", "mix.exs", "README.md", "LICENSE.md"],
   maintainers: ["Quangbuu Le"],
   licenses: ["MIT"],
   links: %{"GitHub" => "https://github.com/quangbuule/phoenix-roads"}
   ]
end

  # Configuration for the OTP application
  #
  # Type "mix help compile.app" for more information
  def application do
    [applications: [:logger]]
  end

  # Dependencies can be Hex packages:
  #
  #   {:mydep, "~> 0.3.0"}
  #
  # Or git/path repositories:
  #
  #   {:mydep, git: "https://github.com/elixir-lang/mydep.git", tag: "0.1.0"}
  #
  # Type "mix help deps" for more examples and options
  defp deps do
    [{:poison, "~> 2.0"},
     {:phoenix, "~> 1.2.1", only: :test},
     {:ex_doc, ">= 0.0.0", only: :dev}]
  end
end
