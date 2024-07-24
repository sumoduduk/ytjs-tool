{
  description = "Yuotube tool flake nix";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
        nodejs = pkgs.nodejs_20;
      in {
        defaultPackage = pkgs.stdenv.mkDerivation {
          name = "node-env";
          buildInputs = [
            nodejs
            pkgs.nodePackages.typescript
            pkgs.nodePackages.prettier
          ];
        };

        devShell = pkgs.mkShell {
          buildInputs = [
            nodejs
            pkgs.bun
            pkgs.nodePackages.typescript
            pkgs.nodePackages.prettier
          ];

          shellHook = ''
            echo "Welcome to the development environment!"
            echo "Node.js version: $(node -v)"
            echo "TypeScript version: $(tsc -v)"
            echo "Prettier version: $(prettier -v)"
          '';
        };
      }
    );
}
