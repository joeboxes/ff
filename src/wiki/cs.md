# C#

## string formatting:



```
// float f = 12345.67890123
string.Format("0:0.0",f); // 12345.7
string.Format("0:0.0000",f); // 12345.6789
string.Format("0:000.000",f); // 12345.679   --- prefix 000s do nothing

string.Format(".",f); // ...
```


## delegate

*definition*
```
public delegate void OnEventNameHereDelegate(ParamTypeA paramA, ParamTypeC paramB, ...);
...
public OnEventNameHereDelegate Callback;
```

*assigning*
```
private void MethodNameHere(ParamTypeA paramA, ParamTypeC paramB, ...){
	...
}
...
instance.Callback = MethodNameHere;
```

*calling*
```
if(Callback != null){
    Callback(paramA, paramB, ...);
}
```






## action

*definition*
```
Action<ClassTypeNameHere> Callback;
```

*assigning*
```
private void MethodNameHere(ClassTypeNameHere param){
	...
}
...
instance.Callback = MethodNameHere;
```

*calling*
```
if(Callback != null){
    Callback(classInstance);
}
```
















## PATTERNS


http://gameprogrammingpatterns.com/contents.html


- Command: operation as an object w/ callback - in a queue/stack
- Flyweight: pointers to commonly used non-varying data, only unique changing data in high-level object
- Observer: event, notification, dispatch, that can be listened for - passed via interface implementing object
- Prototype: like an interface to a generator method that can make "clones" ... prototype languages
- Singleton
- State


- Double Buffer
- Game Loop
- Update Method


- Bytecode
- Subclass Sandbox
- Type Object


- Component
- Event Queue
- Service Locator


- Data Locality
- Dirty Flag
- Object Pool
- Spatial Partition


pool















...



---


