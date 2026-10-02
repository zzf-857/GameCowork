using UnityEngine;

public sealed class GameCoworkQueryComponent : MonoBehaviour
{
    public int health = 37;
    public string label = "owned-query-sentinel";
    [System.Serializable] public sealed class Details { public int score = 91; }
    public Details details = new Details();
    public int[] sampleValues = { 3, 5 };
    [SerializeField, HideInInspector] string hiddenValue = "hidden-query-sentinel";
    public string ThrowingGetter { get { throw new System.InvalidOperationException("Queries must not invoke arbitrary getters"); } }
    public string HiddenFixtureValue { get { return hiddenValue; } }
}
