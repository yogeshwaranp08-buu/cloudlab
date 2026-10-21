Step 1: Install Java and Python
Open the Ubuntu Terminal and run:
sudo apt update
sudo apt install openjdk-17-jdk python3 python3-pip wget -y


Check the installations:
java -version
python3 --version


Step 2: Download Apache Spark
Download Spark with Hadoop 3 support:
cd ~
wget https://archive.apache.org/dist/spark/spark-3.5.7/spark-3.5.7-bin-hadoop3.tgz


Extract it and rename the folder:
tar -xzf spark-3.5.7-bin-hadoop3.tgz
mv spark-3.5.7-bin-hadoop3 spark


Step 3: Set environment variables
Open the Bash configuration file:
nano ~/.bashrc


Add these lines at the bottom:
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export SPARK_HOME=$HOME/spark
export PATH=$PATH:$SPARK_HOME/bin


Save with Ctrl+O, press Enter, and exit with Ctrl+X.

Apply the changes:
source ~/.bashrc


Check Spark:
spark-submit --version


Step 4: Create the input file
mkdir -p ~/spark-wordcount
cd ~/spark-wordcount
echo "hello world hello spark" > input.txt


Step 5: Write the Word Count program
Create the Python file:
nano wordcount.py


Copy this easy program:


from pyspark import SparkContext

sc = SparkContext("local[*]", "WordCount")

text = sc.textFile("input.txt")

words = text.flatMap(lambda line: line.split())

pairs = words.map(lambda word: (word, 1))

counts = pairs.reduceByKey(lambda a, b: a + b)

counts.saveAsTextFile("output")

sc.stop()



Save using Ctrl+O, Enter, and Ctrl+X.
Step 6: Execute the program
Run the Spark application:
cd ~/spark-wordcount
spark-submit --master 'local[*]' wordcount.py


Spark will process the file and save the result in the output directory. The local[*] option lets Spark use the available CPU cores on your machine. 

Spark 3.5.7 Documentation
+1



Step 7: Display the output
cat output/part-*


Expected output (the order may vary):
('hello', 2)
('world', 1)
('spark', 1)


Result
Apache Spark was installed successfully on Ubuntu, and the Word Count program was executed using PySpark to count the occurrences of each word in a text file.

Remember: If you execute the program again, delete the old output directory first:
rm -rf output


Then repeat Step 6 and Step 7.