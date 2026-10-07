using System;
using UnityEngine;

namespace GameCowork.EditorBridge
{
    // Captured GPU pixels and Unity event coordinates use different units.
    // The receiver's requested dpr never substitutes for the actual Editor DPI.
    internal sealed class FrameGeometry
    {
        public int SourceWidth, SourceHeight;
        public float PixelsPerPoint;
        public int ViewInstanceId;
        public Rect ViewScreenRect, WindowScreenRect, WindowContentRect, OutputContentRect;
        public Vector2 ToWindow(Vector2 output)
        {
            if (OutputContentRect.width <= 0 || OutputContentRect.height <= 0) throw new InvalidOperationException("A real editor frame must be captured before input");
            return new Vector2((output.x-OutputContentRect.x)/OutputContentRect.width*ViewScreenRect.width-WindowContentRect.x,
                (output.y-OutputContentRect.y)/OutputContentRect.height*ViewScreenRect.height-WindowContentRect.y);
        }
        public bool InWindow(Vector2 point)
        { return point.x >= 0 && point.y >= 0 && point.x < WindowContentRect.width && point.y < WindowContentRect.height; }
    }
}
