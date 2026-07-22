#!/bin/bash
# Run this once from your terminal:
# cd /Users/sara/Desktop/drida_code/website && bash download-images.sh

mkdir -p assets/images

echo "Downloading 9 candidate photos from Pexels..."

declare -A imgs=(
  ["pexels-14253856"]="https://images.pexels.com/photos/14253856/pexels-photo-14253856.jpeg?auto=compress&cs=tinysrgb&w=1400"
  ["pexels-14252502"]="https://images.pexels.com/photos/14252502/pexels-photo-14252502.jpeg?auto=compress&cs=tinysrgb&w=1400"
  ["pexels-8916176"]="https://images.pexels.com/photos/8916176/pexels-photo-8916176.jpeg?auto=compress&cs=tinysrgb&w=1400"
  ["pexels-8916189"]="https://images.pexels.com/photos/8916189/pexels-photo-8916189.jpeg?auto=compress&cs=tinysrgb&w=1400"
  ["pexels-14252547"]="https://images.pexels.com/photos/14252547/pexels-photo-14252547.jpeg?auto=compress&cs=tinysrgb&w=1400"
  ["pexels-14252550"]="https://images.pexels.com/photos/14252550/pexels-photo-14252550.jpeg?auto=compress&cs=tinysrgb&w=1400"
  ["pexels-8916235"]="https://images.pexels.com/photos/8916235/pexels-photo-8916235.jpeg?auto=compress&cs=tinysrgb&w=1400"
  ["pexels-8916224"]="https://images.pexels.com/photos/8916224/pexels-photo-8916224.jpeg?auto=compress&cs=tinysrgb&w=1400"
  ["pexels-14252564"]="https://images.pexels.com/photos/14252564/pexels-photo-14252564.jpeg?auto=compress&cs=tinysrgb&w=1400"
)

for name in "${!imgs[@]}"; do
  url="${imgs[$name]}"
  out="assets/images/${name}.jpg"
  echo -n "  ${name}... "
  curl -sL "$url" -o "$out" && echo "✓ $(du -sh "$out" | cut -f1)" || echo "✗ FAILED"
done

echo ""
echo "Done! Images saved to assets/images/"
ls -lh assets/images/
