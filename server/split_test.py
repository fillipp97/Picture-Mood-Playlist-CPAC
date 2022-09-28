import re
object_result = ["helloha","your mother fuck","your father boom"]
def divide_objects():
    for ob in object_result:
        print("========== object_result is",object_result)
        print("========== ob is",ob)
        x = re.split(' ', ob)
        print("========== x is",x)
        index = object_result.index(ob)

        if len(x)>=2:
            object_result.remove(ob)
            for i in x:
                object_result.insert(index,i)

if __name__ == "__main__":
    divide_objects()