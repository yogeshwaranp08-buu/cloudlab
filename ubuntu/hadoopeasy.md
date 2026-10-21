Standalone Hadoop with Built-in Word Count
Step 1: Install Java
Open the Ubuntu Terminal:
sudo apt update
sudo apt install openjdk-11-jdk wget -y


Check Java:
java -version


Step 2: Download and extract Hadoop
cd ~
wget https://downloads.apache.org/hadoop/common/hadoop-3.4.1/hadoop-3.4.1.tar.gz
tar -xzf hadoop-3.4.1.tar.gz
mv hadoop-3.4.1 hadoop


Step 3: Set Hadoop environment variables
Open the configuration file:
nano ~/.bashrc


Add these lines at the bottom:
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export HADOOP_HOME=$HOME/hadoop
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin


Save with Ctrl+O, press Enter, then Ctrl+X.

Apply the changes:
source ~/.bashrc


Check the installation:
hadoop version


Step 4: Create an input file
Create a folder and a text file:
mkdir -p ~/wordcount/input
cd ~/wordcount
echo "hello world hello hadoop" > input/input.txt


Check the contents:
cat input/input.txt


Output:
hello world hello hadoop


Step 5: Run the built-in Word Count program
Hadoop already provides a Word Count example, so you don't need to write or compile any Java code.

Run:
hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.4.1.jar wordcount input output


Wait until the job finishes successfully.
Step 6: Display the output
cat output/part-r-00000


Expected output:
hadoop  1
hello   2
world   1


That's it! Your standalone Hadoop Word Count experiment is complete.
Experiment result
Hadoop was installed successfully in standalone mode on Ubuntu, and the built-in Word Count MapReduce program was executed to count the occurrences of words in a text file.

Important: Standalone mode uses the local filesystem, not HDFS. If you run the program again, remove the previous output folder first:
rm -rf output


Then repeat Step 5 and Step 6.