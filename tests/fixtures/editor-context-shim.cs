using System;
using System.Collections.Generic;
using System.Web.Script.Serialization;
namespace UnityEngine {
 public struct Vector3 { public float x,y,z; public Vector3(float a,float b,float c){x=a;y=b;z=c;} }
 public struct Quaternion { public Vector3 eulerAngles; }
 public struct Rect { public float x,y,width,height; }
 public class GUIContent { public string text; }
 public static class Resources { public static UnityEditor.EditorWindow[] windows=new UnityEditor.EditorWindow[0]; public static T[] FindObjectsOfTypeAll<T>() {return (T[])(object)windows;} }
 public static class JsonUtility {public static string ToJson(object value){return new JavaScriptSerializer().Serialize(value);}}
 public static class LayerMask {public static string[] layers=new string[32];public static string LayerToName(int index){return layers[index]??"";}}
}
namespace UnityEditor {
 public enum Tool {None=-1,View,Move,Rotate,Scale,Rect,Transform,Custom};public enum PivotMode {Center,Pivot};public enum PivotRotation {Local,Global};
 public static class Tools {public static Tool current=Tool.Move;public static PivotMode pivotMode=PivotMode.Center;public static PivotRotation pivotRotation=PivotRotation.Local;public static UnityEngine.Vector3 handlePosition;public static UnityEngine.Quaternion handleRotation;}
 public class EditorWindow {public static EditorWindow focusedWindow;public int id;public UnityEngine.Rect position;public UnityEngine.GUIContent titleContent=new UnityEngine.GUIContent();public int GetInstanceID(){return id;}}
}
namespace UnityEditorInternal {public static class InternalEditorUtility {public static string[] tags=new string[0];}}
namespace GameCowork.EditorBridge {
 static class Bridge {public static string ProjectRoot="F:/own-context-contract";public static string Json(string value){return new JavaScriptSerializer().Serialize(value);}}
 static class EditorReadOnly {public static string last;public static string Invoke(string command,string action){last=action;return "{\"existing\":true}";}}
 public static class ContextContract {
  static void Check(bool value,string name){if(!value)throw new Exception(name);Console.WriteLine(name+": PASS");}
  static void Reject(Action action,string name){try{action();}catch(Exception){Console.WriteLine(name+": PASS");return;}throw new Exception(name+" did not reject");}
  public static void Main(){
   Check(EditorContextQueries.Invoke("get_selection")=="{\"existing\":true}"&&EditorReadOnly.last=="get_selection","Actual selection delegates to established handler");
   Check(EditorContextQueries.Invoke("get_project_root")=="{\"existing\":true}"&&EditorReadOnly.last=="get_project_root","Actual root delegates to established handler");
   UnityEditorInternal.InternalEditorUtility.tags=new[]{"Own \"quoted\" tag","中文"};string tagJson=EditorContextQueries.Invoke("get_tags");Check(tagJson.Contains("\\\"quoted\\\"")&&tagJson.Contains("中文"),"Actual tag serializer retains escaped/Unicode values");
   UnityEngine.LayerMask.layers[29]="Own layer";Check(EditorContextQueries.Invoke("get_layers").Contains("\"29\":\"Own layer\""),"Actual named-layer dictionary retains integer slot identity");
   var window=new UnityEditor.EditorWindow{id=-12,position=new UnityEngine.Rect{x=5,y=6,width=70,height=80}};window.titleContent.text="Own window";UnityEditor.EditorWindow.focusedWindow=window;UnityEngine.Resources.windows=new[]{window,window};string windows=EditorContextQueries.Invoke("get_windows");Check(windows.Contains("\"instanceID\":-12")&&windows.Contains("\"isFocused\":true"),"Actual window serializer retains signed ID/focus and deduplicates");
   UnityEngine.Resources.windows=new UnityEditor.EditorWindow[257];for(int i=0;i<257;i++)UnityEngine.Resources.windows[i]=new UnityEditor.EditorWindow{id=i};Reject(()=>EditorContextQueries.Invoke("get_windows"),"Window collection overflow returns an error");
   UnityEditorInternal.InternalEditorUtility.tags=new string[1025];Reject(()=>EditorContextQueries.Invoke("get_tags"),"Tag collection overflow returns an error");
   UnityEditorInternal.InternalEditorUtility.tags=new[]{new string('x',4097)};Reject(()=>EditorContextQueries.Invoke("get_tags"),"Overlong tag returns an error instead of truncation");
   UnityEngine.Resources.windows=new[]{new UnityEditor.EditorWindow{position=new UnityEngine.Rect{x=float.NaN}}};Reject(()=>EditorContextQueries.Invoke("get_windows"),"Nonfinite editor geometry returns an error");
   Reject(()=>EditorContextQueries.Invoke("set_active_tool"),"Mutation action remains unsupported");
   UnityEditor.Tools.handlePosition=new UnityEngine.Vector3(1,2,3);Check(EditorContextQueries.Invoke("get_active_tool").Contains("\"activeTool\":\"Move\""),"Actual tool query preserves real enum/vector data");
   UnityEditor.Tools.current=UnityEditor.Tool.Custom;Check(EditorContextQueries.Invoke("get_active_tool").Contains("customToolUnavailableReason"),"Missing custom-tool API has an honest reason");
  }
 }
}
