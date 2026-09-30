#define __SIZE_TYPE__ unsigned long long
#define __PTRDIFF_TYPE__ long long
#define __LLP64__ 1
#define __INT64_TYPE__ long long
#define __SIZEOF_INT__ 4
#define __INT_MAX__ 0x7fffffff
#define __LONG_MAX__ 0x7fffffffL
#define __SIZEOF_LONG_LONG__ 8
#define __LONG_LONG_MAX__ 0x7fffffffffffffffLL
#define __CHAR_BIT__ 8
#define __ORDER_LITTLE_ENDIAN__ 1234
#define __ORDER_BIG_ENDIAN__ 4321
#define __BYTE_ORDER__ __ORDER_LITTLE_ENDIAN__
#define __WCHAR_TYPE__ unsigned short
#define __WINT_TYPE__ unsigned short
#if __STDC_VERSION__>=201112L
#define __STDC_NO_ATOMICS__ 1
#define __STDC_NO_COMPLEX__ 1
#define __STDC_NO_THREADS__ 1
#endif
#define __declspec(x) __attribute__((x))
#define __cdecl
#define __UINTPTR_TYPE__ unsigned __PTRDIFF_TYPE__
#define __INTPTR_TYPE__ __PTRDIFF_TYPE__
#define __INT32_TYPE__ int
#define __PRETTY_FUNCTION__ __FUNCTION__
#define __has_builtin(x) 0
#define __has_feature(x) 0
#define __has_attribute(x) 0
#define _Nonnull
#define _Nullable
#define _Nullable_result
#define _Null_unspecified
#ifndef __TCC_PP__
#define __builtin_offsetof(type,field) ((__SIZE_TYPE__)&((type*)0)->field)
#define __builtin_extract_return_addr(x) x
typedef char*__builtin_va_list;
#define __builtin_va_arg(ap,t) ((sizeof(t)>8||(sizeof(t)&(sizeof(t)-1)))?**(t**)((ap+=8)-8):*(t*)((ap+=8)-8))
#define __builtin_va_end(ap) (void)(ap)
#ifndef __builtin_va_copy
#define __builtin_va_copy(dest,src) (dest)=(src)
#endif
#ifdef __leading_underscore
#define __RENAME(X) __asm__("_"X)
#else
#define __RENAME(X) __asm__(X)
#endif
#ifdef __TCC_BCHECK__
#define __BUILTINBC(ret,name,params) ret __builtin_##name params __RENAME("__bound_"#name);
#define __BOUND(ret,name,params) ret name params __RENAME("__bound_"#name);
#else
#define __BUILTINBC(ret,name,params) ret __builtin_##name params __RENAME(#name);
#define __BOUND(ret,name,params)
#endif
#define __BOTH __BOUND
#define __BUILTIN(ret,name,params)
__BOTH(void*,memcpy,(void*,const void*,__SIZE_TYPE__))
__BOTH(void*,memmove,(void*,const void*,__SIZE_TYPE__))
__BOTH(void*,memset,(void*,int,__SIZE_TYPE__))
__BOTH(int,memcmp,(const void*,const void*,__SIZE_TYPE__))
__BOTH(__SIZE_TYPE__,strlen,(const char*))
__BOTH(char*,strcpy,(char*,const char*))
__BOTH(char*,strncpy,(char*,const char*,__SIZE_TYPE__))
__BOTH(int,strcmp,(const char*,const char*))
__BOTH(int,strncmp,(const char*,const char*,__SIZE_TYPE__))
__BOTH(char*,strcat,(char*,const char*))
__BOTH(char*,strncat,(char*,const char*,__SIZE_TYPE__))
__BOTH(char*,strchr,(const char*,int))
__BOTH(char*,strrchr,(const char*,int))
__BOTH(char*,strdup,(const char*))
#define __MAYBE_REDIR __BOTH
__MAYBE_REDIR(void*,malloc,(__SIZE_TYPE__))
__MAYBE_REDIR(void*,realloc,(void*,__SIZE_TYPE__))
__MAYBE_REDIR(void*,calloc,(__SIZE_TYPE__,__SIZE_TYPE__))
__MAYBE_REDIR(void*,memalign,(__SIZE_TYPE__,__SIZE_TYPE__))
__MAYBE_REDIR(void,free,(void*))
__BOTH(void*,alloca,(__SIZE_TYPE__))
void*alloca(__SIZE_TYPE__);
__BUILTIN(void,abort,(void))
__BOUND(void,longjmp,())
#undef __BUILTINBC
#undef __BUILTIN
#undef __BOUND
#undef __BOTH
#undef __MAYBE_REDIR
#undef __RENAME
#define __BUILTIN_EXTERN(name,u) int __builtin_##name(u int);int __builtin_##name##l(u long);int __builtin_##name##ll(u long long);
__BUILTIN_EXTERN(ffs,)
__BUILTIN_EXTERN(clz,unsigned)
__BUILTIN_EXTERN(ctz,unsigned)
__BUILTIN_EXTERN(clrsb,)
__BUILTIN_EXTERN(popcount,unsigned)
__BUILTIN_EXTERN(parity,unsigned)
#undef __BUILTIN_EXTERN
#endif
