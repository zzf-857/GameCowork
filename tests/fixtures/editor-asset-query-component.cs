using UnityEngine;
public sealed class GameCoworkAssetQueryComponent : MonoBehaviour
{
    public int value = 7;
    public string ThrowingGetter { get { throw new System.InvalidOperationException("Asset metadata must not invoke arbitrary property getters"); } }
}
